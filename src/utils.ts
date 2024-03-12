const sqlite3 = require('sqlite3').verbose();
import { emojis } from './constants';

export class Logger {
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

export const getLatestVersion = async () => {
    const response = await fetch('https://registry.npmjs.org/trapdog/latest');
    const data = await response.json() as { version: string };
    return data.version;
}

export const initDatabase = (config) => {
    const db = new sqlite3.Database(config.sqlite);
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS attacks (id INTEGER PRIMARY KEY, attack TEXT, ip TEXT, datetime TEXT)');
    });
    return db;
}

export const handleAttack = (res, attack, ip, id, config, logger, log) => {

    logger.logAttack(attack, ip)
    log(`${attack} attack detected : ${id}`, emojis.poop);

    if (config.block) {
        if (!config.hidden) res.setHeader('blocked-by', 'trapdog');
        return res.status(403).send('Forbidden');
    }
}