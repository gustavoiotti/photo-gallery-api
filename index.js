require('dotenv').config();
require('./db/connection');

const cors = require('cors');
const express = require('express');
const photosRouter = require('./routers/photos');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(photosRouter);

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});