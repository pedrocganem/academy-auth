require("./config/database").connect();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const express = require("express");
const User = require("./model/user");
const dotenv = require("dotenv");
const auth = require("./middleware/auth.js");

dotenv.config();


const app = express();

app.use(express.json());

app.post("/register", async (req, res) => {

    try {
        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            res.status(400).send("Missing field, check if email, password, firstname and lastname aren't null");
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User already exists. Please use a different email!");
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword
        });

        const token = jwt.sign({
            user_id: user._id, email
        }, process.env.JWT_KEY,
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

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                user_id: user._id, email
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "720h"
                }
            );
            user.token = token;

            return res.status(201).json(user);
        }
        return res.status(400).send("Invalid Credentials");
    } catch (error) {
        console.log(error);
    }

});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Snow Academy! ☃️");
})


module.exports = app;