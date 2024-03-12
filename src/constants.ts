export const colours = {
    "reset": "\x1b[0m",
    "bold": "\x1b[1m",
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "blue": "\x1b[34m",
    "yellow": "\x1b[33m",
};

export const emojis = {
    "dog": "🐶",
    "paw": "🐾",
    "bone": "🦴",
    "poop": "💩"
};

export const regex = [
    {
        "name": "log4j (CVE-2021-44228)", // https://regex101.com/r/4Hyfon/1
        "regex": "/([\$]|[\%24]){1,3}(?<suspicious_log4j>([\{]|[\%7B]{1,3}).*[jJnNdDiI]{1,4}.+[lLdDaApPsS]{1,5}.+([\/|\%2F]).+)/gm",
        "description": "CVE-2021-44228 is a critical vulnerability in Apache Log4j, enabling remote code execution via its \"lookup\" feature. It impacted Java-based applications, prompting urgent patching efforts globally."
    }
];