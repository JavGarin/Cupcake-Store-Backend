const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const productosRouter = require('./routes/productos');
const authRouter = require('./routes/auth');
const cartRouter = require('./routes/cart');
const pool = require('./config/db');

const app = express();

// Configuración CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/productos', productosRouter);
app.use('/api/cart', cartRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: pool ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? {
      name: err.name,
      stack: err.stack
    } : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`- Auth:       http://localhost:${PORT}/api/auth`);
  console.log(`- Productos:  http://localhost:${PORT}/api/productos`);
  console.log(`- Carrito:    http://localhost:${PORT}/api/cart`);
  console.log(`- Health:     http://localhost:${PORT}/api/health\n`);
});