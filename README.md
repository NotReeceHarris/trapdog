# ![Trapdog](assets/logo.png) ![NPM Version](https://img.shields.io/npm/v/trapdog?style=flat-square) ![NPM License](https://img.shields.io/npm/l/trapdog?style=flat-square) ![NPM Downloads](https://img.shields.io/npm/dw/trapdog?style=flat-square) ![GitHub Release](https://img.shields.io/github/v/release/notreeceharris/trapdog?style=flat-square) ![Codacy grade](https://img.shields.io/codacy/grade/6e2476638d574fd9898d8198acda6d3e?style=flat-square)


<p>Automatically detect attacks towards your Express web application by implementing robust security measures. Utilize intrusion detection systems (IDS) and web application firewalls (WAF) to monitor incoming traffic for suspicious patterns and behaviors. Log all detected attacks, including details such as the source IP address, request payload, and timestamps.</p>

<p>Additionally, implement fingerprinting techniques to gather information about the attacker, such as their user-agent string, IP reputation, and behavior history. This information can be invaluable for identifying repeat offenders and implementing targeted mitigation strategies.</p>


## Installation
```
npm install trapdog@latest
```

## Setup / Usage

To integrate trapdog with your Express site, simply follow this straightforward example. Ensure that you initialize trapdog after parsing the request body.

> [!NOTE]
> If you intend to utilise the trapdog analyzer, it's essential to utilise a file for your SQLite configuration rather than relying on `:memory:`.

```js
const express = require('express');
const trapdog = require('trapdog');

const app = express();
const port = 3001;

// Parse the request body before using trapdog
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize trapdog middleware with your configurations
app.use(trapdog({
    // Your trapdog configurations here
}));

// Define your routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

## Configuration

> [!WARNING]
> Misconfiguring Trapdog can create security vulnerabilities in your web application and potentially disrupt its functionality. It's essential to properly configure Trapdog to avoid these risks and maintain the integrity of your application.

```js
{
    "block": boolean,         // Default: true
    "xss_confidence": number, // Default: 80
    "fingerprint": boolean,   // Default: true
    "verbose": boolean,       // Default: false
    "verbose:emoji": boolean, // Default: true
    "sqlite": string,         // Default: ":memory:"
    "hidden": boolean         // Default: false
}
```

## List of Modules

- Cross site scripting (XSS) [owasp.org ↗](https://owasp.org/www-community/attacks/xss/)
- Sql Injection (SQLI) [owasp.org ↗](https://owasp.org/www-community/attacks/SQL_Injection)
- Local File Inclusion (LFI) [owasp.org ↗](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_Local_File_Inclusion)
- Regex checks
  - Log4J [cve.mitre.org ↗](https://cve.mitre.org/cgi-bin/cvename.cgi?name=cve-2021-44228)

<!--

## Features

> [!NOTE]
> ✅ - Added \
> ❌ - Not added yet \
> ⏳ - Next release


- ✅ SQL Injection Detection
- ✅ XSS/CSS Detection
- ✅ Request Blocking
- ✅ Logging
- ⏳ Analytics
- ⏳ Fingerprinting
