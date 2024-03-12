import semver from 'semver';
import console = require('console');
const sqlite3 = require('sqlite3').verbose();
import { v4 } from 'uuid';

import { version } from '../package.json';
import { Config } from './types';
import { colours, emojis, regex } from './constants';

import attackDetection from 'xss-attack-detection';
import sqliDetection from './lib/sqli';
import lfiDetection from './lib/lfi';
import regexDetection from './lib/regex';

const getLatestVersion = async () => {
    const response = await fetch('https://registry.npmjs.org/trapdog/latest');
    const data = await response.json() as { version: string };
    return data.version;
}

class Logger {
    db: any;
    
    constructor(db: any) {
        this.db = db;
    }

    logAttack(attack: string, ip: string) {
        this.db.serialize(() => {
            this.db.run('INSERT INTO attacks (attack, ip, datetime) VALUES (?, ?, ?)', [attack, ip, new Date().toISOString()]);
        });
    }
}

const initDatabase = (config) => {
    const db = new sqlite3.Database(config.sqlite);
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS attacks (id INTEGER PRIMARY KEY, attack TEXT, ip TEXT, datetime TEXT)');
    });
    return db;
}

const handleAttack = (res, attack, ip, id, config, logger, log) => {

    logger.logAttack(attack, ip)
    log(`${attack} attack detected : ${id}`, emojis.poop);

    if (config.block) {
        if (!config.hidden) res.setHeader('blocked-by', 'trapdog');
        return res.status(403).send('Forbidden');
    }
}

let bodyparserDetected = true;

export default (config: Config) => {

    config = {
        "block": true,
        "xss_confidence": 80,
        "fingerprint": true,
        "verbose": false,
        "verbose:emoji": true,
        "sqlite": ":memory:",
        "hidden": false,
        ...config
    }

    config.regex = [
        ...regex,
        ...config.regex || []
    ]

    const db = initDatabase(config);
    const logger = new Logger(db);

    const log = (message: any, emoji: string) => {
        if (config.verbose) {
            console.log(`${config['verbose:emoji'] ? emoji : `${colours.red}trapdog${colours.reset}`} | ${message}`);
        }
    }

    (async () => {
        const latestVersion = await getLatestVersion();
        if (semver.lt(version, latestVersion)) {
            log(`${colours.yellow}A new version of trapdog is available. Run 'npm i trapdog@${latestVersion}' to update.${colours.reset}`, emojis.dog);
        }
        log(`Initialised trapdog v${version}`, emojis.dog);
    })()

    return (req: any, res: any, next?: any) => {
        if (!bodyparserDetected || !req.body) {
            if (!req.body && bodyparserDetected) {
                log(`No body detected, please use body-parser or similar middleware. (${colours.red}trapdog disabled${colours.reset})`, emojis.poop);
                bodyparserDetected = false;
            }
            return next();
        }

        const requestId = v4();
        const url = req.originalUrl;
        const ip = req.ip || req.connection.remoteAddress;

        const body = Object.entries(req.body).flat()
        const xss_detect = new attackDetection.xssAttackDetection();

        // XSS detection
        if (body.length) {
            const xss_classified = xss_detect.classifyBatch(body)
            for (let i = 0; i < xss_classified.length; i++) {
                const classification = xss_classified[i];
                if (classification.gist === 'malicious' && classification.confidenceFactor >= config.xss_confidence) {
                    return handleAttack(res, 'xss', ip, requestId, config, logger, log);
                }
            }
        }

        // SQLI detection
        const sqliUrlDetected = sqliDetection(url);
        const sqliBodyDetected = body.some(arg => sqliDetection(arg.toString()));
        if (sqliUrlDetected || sqliBodyDetected) {
            return handleAttack(res, 'sqli', ip, requestId, config, logger, log);
        }

        // LFI detection
        const lfiUrlDetected = lfiDetection(url);
        const lfiBodyDetected = body.some(arg => lfiDetection(arg.toString()));
        if (lfiUrlDetected || lfiBodyDetected) {
            return handleAttack(res, 'lfi', ip, requestId, config, logger, log);
        }

        // Regex detection
        const regexUrlDetected = regexDetection(url, config);
        const regexBodyDetected = body.map(arg => regexDetection(arg.toString(), config)).filter(arg => arg.pass)[0] || {pass: true, check: 'regex'} as {pass:boolean, check:string};
        if (!regexUrlDetected.pass || !regexBodyDetected.pass) {
            const regex = !regexUrlDetected.pass ? regexUrlDetected : regexBodyDetected;

            if (!regex.pass) {
                return handleAttack(res, regex.check, ip, requestId, config, logger, log);
            }
        }

        return next();
    }
}