// import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { Express } from 'express';

const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/swaggerOutput.json', 'utf8'));

const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
