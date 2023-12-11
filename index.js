const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;
const SECRET_KEY = 'abrakadabra';

const users = [
  { username: "laci", password: "posidi" },
  { username: "klara", password: "horvilac123" }
];

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected endpoint', user: req.user });
});

app.get('/public', (req, res) => {
  res.json({ message: 'This is a public endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});