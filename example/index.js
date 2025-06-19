const express = require('express');
// import express js
// import sequelize from sequelize

const partner = require('./partner');

// const dotenv = require('dotenv');
// dotenv.config();
// load environment variables from .env file

require('dotenv').config();
// import dotenv to load environment variables


const pg = require('pg');
const { connection, models } = require('./database/Sequelize');
// import connection and models from sequelize
// import pg from pg

// import redisClient from redis


const PORT = 3000;
const app = express();
// create an instance of express


async function initDB() {


  const pgclient = new pg.Client({
    user: process.env.DB_POSTGRES_USERNAME,
    host: process.env.DB_POSTGRES_HOST,
    database: 'postgres',
    password: process.env.DB_POSTGRES_PASSWORD,
    port: process.env.DB_POSTGRES_PORT,
  });

// pgclient.connect()
//     .then(() => {
//         console.log('Connected to PostgreSQL database');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });


// pgclient.connect()
//     .then(() => {
//         let sqlCheck = `SELECT WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.DB_POSTGRES_DBNAME}')`;
//         pgclient.query(sqlCheck).then((val) => {
//           let createDB = `CREATE DATABASE ${process.env.DB_POSTGRES_DBNAME}`;
//           if (val.rowCount === 0) {
//             pgclient.query(createDB);
//           }
//         });
      
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

  await pgclient.connect();
  let sqlCheck = `SELECT WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.DB_POSTGRES_DBNAME}')`;
  let query = await pgclient.query(sqlCheck);
  
  if (query.rowCount > 0) {
    let createDB = `CREATE DATABASE ${process.env.DB_POSTGRES_DBNAME}`;
    await pgclient.query(createDB);
  }
}

initDB().then(async () => {

  await connection.authenticate();
  // authenticate the connection to the database

  await connection.sync({ alter: true, force: false });
  // alter is used to update the database schema to match the model definition
  // force is used to drop the table and recreate it if it already exists
  // sync the models with the database

  global.models = models;


  app.use(express.json());
  // use express json middleware to parse json request body


  // Routing
  app.get('/', (req, res) => {
      // create a route for the root path
      res.send('Hello World!');
      // send a response to the client
  });

  const router = express.Router();

  partner(router);
  // import the partner module and pass the router instance to it

  app.use('/api/v1', router);
  // app.use('/api/v2', router);


  app.listen(PORT, () => {
    // listen on port PORT
    console.log(`Server is running on port ${PORT}`);
  });
  // log to console when server is running


  
});


// const connection = new sequelize.Sequelize(process.env.DB_POSTGRES_DBNAME, 
//   process.env.DB_POSTGRES_USERNAME, 
//   process.env.DB_POSTGRES_PASSWORD, {
//     host: process.env.DB_POSTGRES_HOST,
//     port: process.env.DB_POSTGRES_PORT,
//     dialect: 'postgres',
// });
// create a new instance of sequelize


// connection.authenticate()
//   .then((_) => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });


















// app.get('/api/v1/partner', (req, res) => {
//     // create a route for the about path
//     let jsonResult = [
//         { id: 1, name: 'John',},
//         { id: 2, name: 'Doe',},
//         ]
//     res.json(jsonResult);
//     // send a json response to the client
// });

// app.post('/api/v1/partner', (req, res) => {
//     let body = req.body;
//     // get the request body
//     console.log(body);
//     // log the request body to the console
//     res.json();
//     // send a json response to the client
// });


// create a router instance

// router.get('/partner', (req, res) => {
//     // create a route for the about path
//     let jsonResult = [
//         { id: 1, name: 'John',},
//         { id: 2, name: 'Doe',},
//         ]
//     res.json(jsonResult);
//     // send a json response to the client
// });

// router.post('/partner', (req, res) => {
//     let body = req.body;
//     // get the request body 
//     console.log(body);
//     // log the request body to the console
//     res.json();
//     // send a json response to the client
// });

// router.post('/partner', (req, res) => {
//     let status_code = 200;
//     let result = null
//     try {
        
//     } catch (error) {
//         status_code = 400;
//         result=error;
        
//     }finally {
//         res.status(status_code).json({result});
//     }
// });



