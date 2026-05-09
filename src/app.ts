import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(cookieParser());

// Application route
app.use('/api/v1/', router);

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello World');
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
