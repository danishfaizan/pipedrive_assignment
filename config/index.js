require('dotenv').config();

module.exports = {
  HTTP_SERVER_PORT: process.env.HTTP_SERVER_PORT,
  DB_SERVER_HOST: process.env.DB_SERVER_HOST,
  DB_SERVER_PORT: process.env.DB_SERVER_POST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.PDB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
};
