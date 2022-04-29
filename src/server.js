const express = require('express');
const app = express();
const mongoose = require('mongoose');
const auth = require('./Helpers/jwt.js')
const unless = require('express-unless')
const users = require('./Controllers/UserController.js')
const errors = require('./Helpers/ErrorHandler.js')
require("dotenv").config();

auth.authenticateToken.unless = unless
app.use(auth.authenticateToken.unless({
    path: [
        { url: '/users/login', methods: ['POST']},
        { url: '/users/register', methods: ['POST']}
    ]
}))

app.use(express.json()) 
app.use('/users', users) 
app.use(errors.errorHandler);


/// [MONGODB]
const uri = "mongodb+srv://pedrocganem:" + process.env.DB_KEY + "@cluster0.tblrz.mongodb.net/test?retryWrites=true&w=majority";
const uri2 = "mongodb+srv://pedrocganem:g4n3m123@cluster0.tblrz.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri2, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to mongo at ${uri}`));


app.listen(process.env.PORT || 3002);