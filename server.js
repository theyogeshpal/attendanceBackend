require('dotenv').config();
const e = require('express');
const app = require('./src/app')
const connectDB = require('./src/db/db')

connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app running on port ${port}`)
})