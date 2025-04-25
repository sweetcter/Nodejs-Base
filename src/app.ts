import express, { Express } from 'express';
import { corsOptions } from './config/cors.config';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';
import notFoundHandler from './middlewares/notFoundHandlerMiddleware';
import errorHandler from './middlewares/errorHandlerMiddleware';

const app: Express = express();

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use(cookieParser());

app.use(
    express.json({
        limit: '5mb',
    }),
);
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
