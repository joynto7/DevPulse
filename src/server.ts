import app from './app';
import pool from './config/db';

// Vercel imports this module and runs the app as a serverless function (no listen).
export default app;

const PORT = process.env.PORT ?? 3000;

if (!process.env.VERCEL) {
  pool
    .query('SELECT 1')
    .then(() => {
      console.log('Database connected');
      app.listen(PORT, () => console.log(`Server on port ${PORT}`));
    })
    .catch((e) => {
      console.error('DB connection failed:', e);
      process.exit(1);
    });
}