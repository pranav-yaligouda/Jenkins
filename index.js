import { NODE_ENV, PORT } from './config/envconfig.js';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send({ message: "Welcome to the Express Server with Jeninks CI/CD"});
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
})