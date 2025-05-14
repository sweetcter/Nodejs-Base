import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'E-commerce API',
        description: 'Tài liệu API cho hệ thống E-commerce',
    },
    host: 'localhost:8000',
    schemes: ['http'],
};

const outputFile = './src/config/swaggerOutput.json';
const endpointsFiles = ['./src/routes/index.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
