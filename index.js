const express = require('express');
const cors = require('cors');
const productosRouter = require('./routes/productos.routes');
const authRouter = require('./routes/auth');

const app = express();

// Configuración CORS actualizada
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/productos', productosRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Cupcake Store funcionando');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Conectado a la base de datos: ${process.env.DB_NAME}`);
});