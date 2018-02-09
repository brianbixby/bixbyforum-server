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

// USERS
// SIGNUP
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

// LOGIN
app.get('/api/db/users/:username', (req,res) => {
  client.query(`SELECT * FROM users WHERE user_name=$1;`, [req.params.username])
  .then(client.query(`UPDATE users SET last_login = to_timestamp(${Date.now()}/1000) WHERE user_name=$1;`, [req.params.username]))
  .then(result => {
    if (!result.rows.length) throw 'User does not exist';
    res.status(200).send(result.rows);})
  .catch(err => { console.log(err); res.status(500).send(err);});
});

// UPDATE
app.put('/api/db/users/:username', (req,res) => {
  if(req.body.email) {
    client.query(`UPDATE users SET first_name=$1, last_name=$2, email=$3, username=$4, interests=$5, gravatar_hash=$6 WHERE username=$7;`,
    [req.body.first_name, req.body.last_name, req.body.email, req.body.username, req.body.interests, req.body.gravatar_hash, req.params.username])
    .then(() => {
    let user = {username: req.body.username, gravatar_hash: req.body.gravatar_hash}; 
    res.send(user);
  })
}
  else {
    client.query(`UPDATE users SET first_name=$1, last_name=$2, username=$3, interests=$4, gravatar_hash=$5 WHERE username=$6;`,
    [req.body.first_name, req.body.last_name, req.body.username, req.body.interests, req.body.gravatar_hash, req.params.username])
    .then(() => {
      let user = {username: req.body.username, gravatar_hash: req.body.gravatar_hash}; 
      res.send(user);
    })
  }
});

// DELETE
app.delete('/api/db/users/:username', (req,res) => {
  client.query(`DELETE FROM users WHERE user_name=$1;`, [req.params.username])
    .then(result => res.send('success'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));