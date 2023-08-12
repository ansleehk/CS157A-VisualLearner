const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'cs157a',
    password: 'cs157acs157a',
    database: 'cs157a'
});


async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful!');
    connection.release();
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}


module.exports = pool;