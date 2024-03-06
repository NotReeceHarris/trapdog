<p align="center">
    <img src="assets/logo_3.png" width="200px">
</p>

<h1 align="center">🪤 TrapDog</h1>

<p>Automatically detect attacks towards your Express web application by implementing robust security measures. Utilize intrusion detection systems (IDS) and web application firewalls (WAF) to monitor incoming traffic for suspicious patterns and behaviors. Log all detected attacks, including details such as the source IP address, request payload, and timestamps.</p>

<p>Additionally, implement fingerprinting techniques to gather information about the attacker, such as their user-agent string, IP reputation, and behavior history. This information can be invaluable for identifying repeat offenders and implementing targeted mitigation strategies.</p>


## Installation
```
npm install trapdog@latest
```

## Usage
```js
const express = require('express');
const trapdog = require('trapdog');

const app = express();
const port = 3001;

// Make sure to parse body before using trapdog
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(trapdog({
    // Your configs
}));

app.get('/', (req, res) => {
  res.send('Hello, WOrld!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

## Configuration

> [!WARNING]
> Misconfiguring Trapdog can create security vulnerabilities in your web application and potentially disrupt its functionality. It's essential to properly configure Trapdog to avoid these risks and maintain the integrity of your application.

```js
{
    "block": boolean, // Default: true
    "xss_confidence": number, // Default: 80
    "fingerprint": boolean, // Default: true
    "verbose": boolean, // Default: false
    "verbose:emoji": boolean, // Default: true
    "sqlite": string // Default: ":memory:"
}
```

## Features

- ✅ SQL Injection Detection
- ✅ XSS/CSS Detection
- ✅ Request Blocking
- ✅ Logging
- ⏳ Analytics
- ⏳ Fingerprinting

> [!NOTE]
> ✅ - Added \
> ❌ - Not added yet \
> ⏳ - In-Progress 
