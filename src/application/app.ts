import express from 'express';
import { publicRouter } from '../routes/public.routes';
import { errorMiddleware } from '../middleware/error.middleware';
import { apiRouter } from '../routes/routes';

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(publicRouter);
app.use(apiRouter);

app.use((_req, res, _next) => {
  res.status(404).json({
    errors: 'URI Not Found',
  });
});

app.use(errorMiddleware);
