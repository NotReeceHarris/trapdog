import fetch from 'node-fetch';
import semver from 'semver';
import console = require('console');
const sqlite3 = require('sqlite3').verbose();

import { version } from '../package.json';
import { Config } from './types';
import { colours, emojis } from './constants';

import attackDetection from 'xss-attack-detection';
import sqliDetection from './lib/sqli';

const getLatestVersion = async () => {
    const response = await fetch('https://registry.npmjs.org/trapdog/latest');
    const data = await response.json();
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
        db.run(`
        CREATE TABLE IF NOT EXISTS attacks (
            id INTEGER PRIMARY KEY, 
            attack TEXT, 
            ip TEXT, 
            datetime TEXT
        )`);
    });
    return db;
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
        ...config
    }

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
        if (!bodyparserDetected) {
            return next();
        }

        if (!req.body) {
            log(`No body detected, please use body-parser or similar middleware. (${colours.red}trapdog disabled${colours.reset})`, emojis.poop);
            bodyparserDetected = false;
            return next();
        }

        const method = req.method;
        const url = req.originalUrl;
        const ip = req.ip || req.connection.remoteAddress;

        const payload = Object.entries(req.body).flat()
        const xss_detect = new attackDetection.xssAttackDetection();

        // XSS detection
        if (payload.length) {
            const xss_classified = xss_detect.classifyBatch(payload)
            for (let i = 0; i < xss_classified.length; i++) {
                const classification = xss_classified[i];
                if (classification.gist === 'malicious' && classification.confidenceFactor >= config.xss_confidence) {
                    logger.logAttack('xss', ip)
                    log('XSS attack detected', emojis.poop);

                    if (config.block) {
                        return res.status(403).send('Forbidden');
                    }
                }
            }
        }

        // SQLI detection
        const sqliDetected = sqliDetection(url);
        if (sqliDetected) {
            logger.logAttack('sqli', ip)
            log('SQLi attack detected', emojis.poop);

            if (config.block) {
                return res.status(403).send('Forbidden');
            }
        }

        return next();
    }
}