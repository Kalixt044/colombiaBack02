import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from './database.js';
import { login } from './endpoints/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('src'));

// Creación de la tabla Users
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT,
  lastName TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password TEXT NOT NULL
);
`;

try {
  db.exec(createUsersTable);
  console.log('Tabla "users" creada o ya existe.');
} catch (err) {
  console.error('Error creando la tabla "users":', err);
}

// Creación de la tabla Person
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

app.get('/', (req, res) => {
  res.send('Servidor Proyecto Final');
});

// Aquí van tus otras rutas y middleware...

app.post('/login', login);

const PORT = process.env.PORT || 8050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
