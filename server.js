const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'abrakadabra'

const users = [
  { username: "laci", password: "posidi" },
  { username: "klara", password: "horvilac123" }
];

const app = express()
app.use(bodyParser.json())

app.get("/greet/:name", (req, res) => {
    const name = req.params.name
    res.json({
        hello: name
    })
})

app.get('/search/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId
    const term = req.query.term
    res.json({
        term,
        categoryId,
        results: []
    })
})

app.post("/registrace", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    res.send({
        username
    })
})

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
  
  app.get('/search', (req, res) => {
      const term = req.query.term
      res.json({
          term,
          results: []
      })
  })
  
app.listen(5000, () => {
    console.log("server is running")
})