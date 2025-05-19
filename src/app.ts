import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors.config';
import setupSwagger from './config/swaggerConfig.config';
import errorHandler from './middlewares/errorHandlerMiddleware';
import notFoundHandler from './middlewares/notFoundHandlerMiddleware';
import router from './routes';

const app: Express = express();

app.use(cors(corsOptions));
setupSwagger(app);
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

app.use('/api/v1', router);
app.use('/static', express.static('public'));

app.use(errorHandler);
app.use(notFoundHandler);

export default app;
