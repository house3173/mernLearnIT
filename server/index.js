
// Import library
const express = require('express');
const mongoose = require('mongoose');

// Import from created file
require('dotenv').config()
const authRouter = require('./routes/auth')

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@atlascluster.hpya52n.mongodb.net/`, {
            // useCreateIndex: true,
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false
        })

        console.log('Connect mongoose sucessfull!');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

connectDB();

const app = express();
app.use(express.json())

app.use('/api/auth', authRouter);

app.get('/', (req,res) => res.send('Hello world!'));

const PORT = 3000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
