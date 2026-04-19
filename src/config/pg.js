const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => console.log("PostgreSQL connected ✅"));

module.exports = pool;
