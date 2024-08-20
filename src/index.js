import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from './database.js';
import * as endpoints from './endpoints/index.js';
import jwt from 'jsonwebtoken';

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

// Ruta de login actualizada
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'tu_secreto_jwt', // Cambia esto por una clave secreta más segura
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Ruta de registro
app.post('/register', (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const insert = db.prepare('INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)');
    insert.run(firstName, lastName, email, phone, password);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 8050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
