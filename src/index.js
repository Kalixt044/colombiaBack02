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

// **Creación de la tabla Users** //
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  acceptTerms INTEGER NOT NULL,
  username TEXT NOT NULL UNIQUE
);
`;

try {
  db.exec(createUsersTable);
  console.log('Tabla "users" creada o ya existe.');
} catch (err) {
  console.error('Error creando la tabla "users":', err);
}

// **Creación de la tabla Person** //
const createPersonTable = `
CREATE TABLE IF NOT EXISTS person (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alias TEXT NOT NULL,
  activity TEXT,
  country TEXT,
  userId INTEGER,
  FOREIGN KEY (userId) REFERENCES users(id)
);
`;

try {
  db.exec(createPersonTable);
  console.log('Tabla "person" creada o ya existe.');
} catch (err) {
  console.error('Error creando la tabla "person":', err);
}

const data = [
  { firstName: "Veronica", lastName: "Jimenez", email: "VeroJi@example.com", phone: "3884458", password: "password123", acceptTerms: 1, username: "Vero" },
  { firstName: "Nikki", lastName: "Fontalvo", email: "Nikol@example.com", phone: "37445521", password: "password123", acceptTerms: 1, username: "Moon" },
];

// Preparamos la consulta de inserción
const insertData = db.prepare('INSERT INTO users (firstName, lastName, email, phone, password, acceptTerms, username) VALUES (?, ?, ?, ?, ?, ?, ?)');

// Insertamos los datos en una transacción
const insertMany = db.transaction((users) => {
  for (const user of users) {
    insertData.run(user.firstName, user.lastName, user.email, user.phone, user.password, user.acceptTerms, user.username);
  }
});

// Ejecutamos la inserción
insertMany(data);

// Endpoint para obtener todos los usuarios
app.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
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
