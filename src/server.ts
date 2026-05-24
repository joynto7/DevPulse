import app from './app';
import pool from './config/db';

const PORT = process.env.PORT ?? 3000;

pool.query('SELECT 1')
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch((e) => {
    console.error('DB connection failed:', e);
    process.exit(1);
  });