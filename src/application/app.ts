import express from 'express';
import { publicRouter } from '../routes/public.routes';
import { errorMiddleware } from '../middleware/error.middleware';

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(publicRouter);

app.use(errorMiddleware);