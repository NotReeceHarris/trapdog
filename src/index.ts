import { v4 } from 'uuid';
import gt from 'semver/functions/gt';
import lt from 'semver/functions/lt';

import { Config } from './types';
import { version } from '../package.json';
import { colours, emojis, regex } from './constants';
import { Logger, getLatestVersion, initDatabase, handleAttack } from './utils';

import lfiDetection from './lib/lfi';
import sqliDetection from './lib/sqli';
import regexDetection from './lib/regex';
import attackDetection from 'xss-attack-detection';

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

        if (lt(version, latestVersion)) {
            log(`${colours.yellow}A new version of trapdog is available. Run 'npm i trapdog@${latestVersion}' to update.${colours.reset}`, emojis.bone);
        }

        if (gt(version, latestVersion)) {
            log(`${colours.yellow}You are using a unreleased version of trapdog, there may be unstable features.${colours.reset}`, emojis.bone);
        }

        log(`Initialised trapdog v${version}`, emojis.dog);
    })()
    
    function handleMissingBody(req: any) {
        if (!req.body && bodyparserDetected) {
            log(`No body detected, please use body-parser or similar middleware. (${colours.red}detection on body data disabled${colours.reset})`, emojis.bone);
            bodyparserDetected = false;
        }
    }
    
    function detectXssAttack(body: any[], ip: string, requestId: string, res: any) {
        const xssDetect = new attackDetection.xssAttackDetection();
        const xssClassified = xssDetect.classifyBatch(body);
        for (let i = 0; i < xssClassified.length; i++) {
            const classification = xssClassified[i];
            if (classification.gist === 'malicious' && classification.confidenceFactor >= config.xss_confidence) {
                return handleAttack(res, 'xss', ip, requestId, config, logger, log);
            }
        }
    }

    function detectSqliAttack(body: any[], url: string, ip: string, requestId: string, res: any) {
        const sqliUrlDetected = sqliDetection(url);
        const sqliBodyDetected = body.some(arg => sqliDetection(arg.toString()));
    
        if (sqliUrlDetected || sqliBodyDetected) {
            return handleAttack(res, 'sqli', ip, requestId, config, logger, log);
        }
    }

    function detectLfiAttack(body: any[], url: string, ip: string, requestId: string, res: any) {
        const lfiUrlDetected = lfiDetection(url);
        const lfiBodyDetected = body.some(arg => lfiDetection(arg.toString()));
    
        if (lfiUrlDetected || lfiBodyDetected) {
            return handleAttack(res, 'lfi', ip, requestId, config, logger, log);
        }
    }

    function detectRegexAttack(body: any[], url: string, ip: string, requestId: string, res: any) {
        const regexUrlDetected = regexDetection(url, config);
        const regexBodyDetected = body.map(arg => regexDetection(arg.toString(), config)).filter(arg => arg.pass)[0] || {pass: true, check: 'regex'} as {pass:boolean, check:string};
    
        if (!regexUrlDetected.pass || !regexBodyDetected.pass) {
            const regex = !regexUrlDetected.pass ? regexUrlDetected : regexBodyDetected;
    
            if (!regex.pass) {
                return handleAttack(res, regex.check, ip, requestId, config, logger, log);
            }
        }
    }

    return (req: any, res: any, next?: any) => {
        if (!bodyparserDetected || !req.body) {
            handleMissingBody(req, next);
        }
    
        const requestId = v4();
        const url = req.originalUrl;
        const ip = req.ip || req.connection.remoteAddress;
        const body = Object.entries(req.body || {}).flat();
    
        if (detectXssAttack(body, ip, requestId, res)) return;
        if (detectSqliAttack(body, url, ip, requestId, res)) return;
        if (detectLfiAttack(body, url, ip, requestId, res)) return;
        if (detectRegexAttack(body, url, ip, requestId, res)) return;
    
        return next();
    }
}