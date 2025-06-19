const express = require('express');
require('dotenv').config();
const pg = require('pg');
const { connection, models } = require('./database/Sequelize');
// const redisClient = require('./database/Redis');
// const { authMiddleware, adminMiddleware } = require('../auth/middleware');



const PORT = 3000;
const app = express();

async function initDB() {

  const pgclient = new pg.Client({
    user: process.env.DB_POSTGRES_USERNAME,
    host: process.env.DB_POSTGRES_HOST,
    database: 'postgres',
    password: process.env.DB_POSTGRES_PASSWORD,
    port: process.env.DB_POSTGRES_PORT,
  });

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
  await connection.sync({ alter: true, force: false });

  global.models = models;

  // --- SEED SUPERADMIN ROLE AND ADMIN USER ---
  const { Roles, Users } = models;
  // 1. Create superadmin role if not exists
  let superadminRole = await Roles.findOne({ where: { name: 'superadmin' } });
  if (!superadminRole) {
    superadminRole = await Roles.create({
      name: 'superadmin',
      description: 'Super Administrator',
      is_admin: true
    });
    console.log('Superadmin role created.');
  }

  // 2. Create admin user if not exists
  let adminUser = await Users.findOne({ where: { username: 'admin' } });
  if (!adminUser) {
    adminUser = await Users.create({
      username: 'admin',
      password: 'admin', // In production, hash this!
      email_address: 'admin@example.com',
      roleId: superadminRole.id
    });
    console.log('Admin user created with username: admin and password: admin');
  }
  // --- END SEED ---

  app.use(express.json());

  // Routing
  app.get('/', (req, res) => {
      res.send('Hello World!');
  });

  const router = express.Router();

  // Register users CRUD routes on the existing router
  require('./auth')(router);
  require('./users')(router);
  require('./roles')(router);
  require('./books')(router);
  require('./reviews')(router);
  require('./favorites')(router);

  app.use('/api/v1', router);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

});