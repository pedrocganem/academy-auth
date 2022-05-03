require("./config/database").connect();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const express = require("express");
const User = require("./model/user");

require("dotenv").config();


const app = express();

app.use(express.json());

app.post("/register", (req, res) => {

    try {
        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            res.status(400).send("Missing field, check if email, password, firstname and lastname aren't null");
        }

        let oldUser = await User.findOne({ email }).then(() => {
            console.log(oldUser);
        });

        if (oldUser) {
            return res.status(409).send("User already exists. Please use a different email!");
        }

        encryptedPassword = bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        });

        const token = jwt.sign({
            user_id: user._id, email
        }, process.env.TOKEN_KEY,
            {
                expiresIn: "720h"
            }
        );

        user.token = token;

        res.status(201).json(user);

    } catch (error) {
        console.log(error);
    }
});

app.post("/login", (req, res) => {

});

//TODO implement requests


module.exports = app;