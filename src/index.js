import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('src'));

let db;

try {
  db = new Database('Colombia.db', { verbose: console.log });
  console.log('Conectado a la base de datos SQLite');
} catch (err) {
  console.error('Error conectando a la base de datos SQLite:', err);
  process.exit(1);
}

// Manejar el cierre de la conexión cuando el servidor se apaga
process.on('SIGINT', () => {
  db.close();
  console.log('Conexión a la base de datos cerrada');
  process.exit(0);
});

app.get('/', (req, res) => {
  res.send('Servidor Proyecto Final');
});

// Endpoint para obtener todos los clientes
app.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY id').all();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error ejecutando la consulta:', err);
    res.status(500).send('Error de consulta');
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 8050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
/*const query = `
CREATE TABLE users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name STRING NOT null,
username STRING NOT NULL UNIQUE
)
`;

db.exec(query); */

const data = [
  { name: "Lau", username: "Lulu" },
  { name: "Ximena", username: "Jime" },
];

// Preparamos la consulta de inserción
const insertData = db.prepare('INSERT INTO users (name, username) VALUES (?, ?)');

// Insertamos los datos en una transacción
const insertMany = db.transaction((users) => {
  for (const user of users) {
    insertData.run(user.name, user.username);
  }
});

// Ejecutamos la inserción
insertMany(data)

// Cerramos la conexión a la base de datos.
db.close();
