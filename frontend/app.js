const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

// Middleware para procesar datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de la conexión usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// Ruta para ver los productos (GET)
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    // ESTO ES LO IMPORTANTE: Ver el error real en los logs de docker
    console.error("DETALLE DEL ERROR RDS:", err.message); 
    res.status(500).send('Error al conectar con la base de datos RDS');
  }
});

// Ruta para insertar productos (POST)
app.post('/api/productos', async (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;
  try {
    await pool.query(
      'INSERT INTO productos (nombre, categoria, precio, stock) VALUES ($1, $2, $3, $4)',
      [nombre, categoria, precio, stock]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar el producto');
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`ERP Farmacia Cruz Azul funcionando en puerto ${PORT}`);
});
