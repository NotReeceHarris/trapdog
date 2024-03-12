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
        "regex": "([\$]|[\%24]){1,3}(?<suspicious_log4j>([\{]|[\%7B]{1,3}).*[jJnNdDiI]{1,4}.+[lLdDaApPsS]{1,5}.+([\/|\%2F]).+)",
        "flag": "gm",
        "description": "CVE-2021-44228 is a critical vulnerability in Apache Log4j, enabling remote code execution via its \"lookup\" feature. It impacted Java-based applications, prompting urgent patching efforts globally."
    },
    {
        "name": "Common RCE",
        "regex": "(?:exec|execute|cmd|command|shell)",
        "flag": "gm",
        "description": "This pattern searches for keywords commonly associated with command execution or shell access in HTTP requests or responses, which may indicate attempts to exploit RCE vulnerabilities."
    },
    {
        "name": "Class Loading or Reflection",
        "regex": "(?:ClassLoader|Class\.forName|Reflection)",
        "flag": "gm",
        "description": "This pattern matches instances where Java Class Loading or Reflection APIs are used. These APIs can potentially be exploited for arbitrary code execution, hence they are often scrutinized in security audits."
    },
    {
        "name": "Payload Patterns",
        "regex": "(?:javax\.management\.loading\.MLet|.*\:eval|.*\:bash|.*\:python)",
        "flag": "gm",
        "description": "This pattern matches common payload patterns used in command injection attacks. It includes the use of MLet which is a part of Java's management extensions (JMX), and scripts executed via 'eval', 'bash', or 'python'."
    },
    {
        "name": "System Property Access",
        "regex": "(?:System\.getProperties|System\.getProperty)",
        "flag": "gm",
        "description": "This pattern matches instances where Java System Properties are accessed. This can be used to obtain sensitive information or to manipulate the runtime environment."
    }
];