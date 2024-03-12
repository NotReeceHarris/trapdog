import { Config } from '../types';

export default function (value: string, config: Config): {
    pass: boolean,
    check: string
} {

    const checks = config.regex || []

    if (value === null || value === undefined) {
        return {
            "pass": true,
            "check": "regex"
        };
    }

    for (let i = 0; i < checks.length; i++) {
        const check = checks[i];

        if (value.match(new RegExp(check.regex)).length > 0) {
            return {
                "pass": false,
                "check": check.name
            };
        }
    }

    return {
        "pass": true,
        "check": "regex"
    };
}