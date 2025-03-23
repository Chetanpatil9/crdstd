const { Client } = require('pg');
require('dotenv').config();

const db = new Client({
  host: 'localhost',
  port: 5432,
  database: 'task', 
  user: 'postgres',
  password: 'Chetan@22', 
});

db.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

module.exports = db;
