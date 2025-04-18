import fs from 'fs';
import morgan from 'morgan';
import express from 'express';

const app = express();
const articles = [];
app.use(morgan('common'));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.static('public'));
app.get('/articles', (req, res) => {
  // const file = fs.readFileSync('public/index.html');
  res.send(articles);
});
app.use(express.urlencoded({ extended: true }));
app.post('/articles', (req, res) => {
  if (!req.body.title) {
    res.status(400);
    res.send('nincs cim');
    return;
  }
  if (!req.body.date || !req.body.date.match(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/u)) {
    res.status(400);
    res.send('rossz datum');
    return;
  }
  res.send('valasz');
  articles.push(req.body);
});
app.listen(8080, () => {
  console.log('elindul a szerver');
});

console.log('hello');
