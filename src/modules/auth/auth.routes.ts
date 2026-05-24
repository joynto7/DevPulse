import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../../config/db';
import { ok, created, err } from '../../utils/response';


const router = Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string; email: string; password: string; role: string;
    };

    if (!name || !email || !password || !role) {
      err(res, 400, 'All fields are required.'); return;
    }
    if (!['contributor', 'maintainer'].includes(role)) {
      err(res, 400, 'Role must be contributor or maintainer.'); return;
    }

    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length > 0) { err(res, 400, 'Email already registered.'); return; }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4)
       RETURNING id,name,email,role,created_at,updated_at`,
      [name, email, hashed, role]
    );
    created(res, 'User registered successfully', result.rows[0]);
  } catch (e) {
    err(res, 500, 'Server error.', (e as Error).message);
  }
});


router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) { err(res, 400, 'Email and password required.'); return; }

    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0] as {
      id: number; name: string; email: string; password: string;
      role: string; created_at: Date; updated_at: Date;
    } | undefined;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      err(res, 401, 'Invalid email or password.'); return;
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
    );

    const { password: _pw, ...userOut } = user;
    void _pw;
    ok(res, 'Login successful', { token, user: userOut });
  } catch (e) {
    err(res, 500, 'Server error.', (e as Error).message);
  }
});

export default router;

