import { NODE_ENV, PORT } from './config/envconfig.js';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send({ message: "Welcome to the Express Server with Jenkins CI/CD"});
})

app.get('/health', (req, res) => {
    res.status(200).send({ status: "ok", uptime: process.uptime() });
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
})