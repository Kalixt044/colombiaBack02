import Database from 'better-sqlite3';

export const db = new Database('Colombia.db', { verbose: console.log });

process.on('SIGINT', () => {
  db.close();
  console.log('Conexión a la base de datos cerrada');
  process.exit(0);
});
