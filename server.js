'use strict';

const express = require('express');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3737;
// const conString = process.env.DATABASE_URL;
const conString = 'postgres://localhost:5432/bixbyforum';
const client = new pg.Client(conString);
client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.set('etag', 'strong');

app.get('/', (req, res) => {
  res.send('taco');
})

// USERS
app.post('/api/db/users', (req,res) => {
  client.query(`INSERT INTO users (user_name, created_on, comment_count, role, last_login) VALUES ($1,to_timestamp(${Date.now()}/1000),0,'user',to_timestamp(${Date.now()}/1000));`,
    [req.body.username])
    .then(() => {
      client.query(`SELECT * FROM users WHERE user_name=$1;`,
      [req.body.username])
      .then(result => {
        if (!result.rows.length) {
          throw 'Username already exists';
        }
        else {
           // console.log(result.rows);
           res.status(200).send(result.rows);
        }
      })
    })
    .catch(err => { 
      client.query(`SELECT user_name FROM users WHERE user_name LIKE $1;`,
      [req.body.username + '%'])
      .then(result => {
        // console.log(err); 
        res.status(500).send(result.rows);
      })
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));