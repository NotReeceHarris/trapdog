<p align="center">
    <img src="assets/logo_3.png" width="200px">
</p>

<h1 align="center">TrapDog</h1>

Automatically detects, logs, and tracks potential attacks, empowering you to swiftly block and trace attack vectors for enhanced security of your NodeJS web-app.


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
