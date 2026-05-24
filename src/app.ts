import express , { Application,Request, Response, NextFunction} from 'express' ;
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import issueRoutes from './modules/issues/issues.routes';


dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/',(req:Request, res:Response ) => {
  res.json({ message: ' DevPulse API is running ! '});
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => { 
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error', errors: err.message });
});

export default app;
