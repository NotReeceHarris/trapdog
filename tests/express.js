const express = require('express');
const trapdog = require('../dist/index');

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(trapdog({
  verbose: true,
  sqlite: 'test.db'
}));

app.get('/', (req, res) => {
  res.sendFile('./index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});