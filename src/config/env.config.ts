import Joi from 'joi';
import dotenv from 'dotenv';
import 'dotenv/config';

if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env.local' });
}

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development').required(),
        PORT: Joi.number().default(80),
        HOSTNAME: Joi.string().default('127.0.0.1'),
        MONGODB_URL_DEV: Joi.string().description('Local Mongo DB'),
        // MONGODB_URL_CLOUD: Joi.string().description('Cloud Mongo DB'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    hostname: envVars.HOSTNAME,
    mongoose: {
        url: envVars.MONGODB_URL_DEV,
        options: {
            dbName: 'dev',
        },
    },
};

export default config;
