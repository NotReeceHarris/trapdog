export interface Config {
    "block": boolean,
    "xss_confidence": number,
    "fingerprint": boolean,
    "verbose": boolean,
    "verbose:emoji": boolean,
    "sqlite": string,
    "hidden": boolean,
    "regex": {
        "name": string,
        "regex": string,
        "description": string
    }[]
}