import { db } from '../database.js';

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Se requieren correo y contraseña' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);

    if (user) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
    } else {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('Error durante el inicio de sesión:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
