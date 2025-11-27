// check-db.js
const pool = require('./config/database'); // caminho seu
(async () => {
  try {
    const [dbRow] = await pool.execute('SELECT DATABASE() AS db');
    console.log('DATABASE():', dbRow[0].db);
    const [ver] = await pool.execute('SELECT VERSION() AS v');
    console.log('MySQL VERSION:', ver[0].v);
  } catch (err) {
    console.error('ERRO check-db:', err);
  } finally {
    process.exit(0);
  }
})();
