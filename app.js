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

    console.log(req.body);
    console.log(req.headers);


    try {
        const { first_name, last_name, email, password } = req.body;

        console.log(req.body);
        console.log(req.headers);

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
        /// Parses request body into [email] and [password] variables.
        const { email, password } = req.body;

        /// Looks for the user by the e-mail on the database. 
        const user = await User.findOne({ email });

        /// Checks if user exists and checks if the password is correct
        if (user && (await bcrypt.compare(password, user.password))) {

            /// Generate user token.
            const token = jwt.sign({
                user_id: user._id, email
            },
                process.env.JWT_KEY,
                {
                    expiresIn: "720h"
                }
            );
            user.token = token;
            
            /// Returns success if everything checks up!
            return res.status(201).json(user);
        }
        /// Return an error
        return res.status(400).send("Invalid Credentials");
    } catch (error) {
        console.log(error);
    }

});

app.get("/students", auth, (req, res) => {
    const response = {
        "students" : [
            "Rodolfo",
            "Laís",
            "Eric",
            "Emmanuel",
            "Victor",
            "Wilsley",
            "Thiago",
            "Gabriel",
            "Isabella",
            "Matheus"
        ]
    }
    res.status(200).json(response);
})


module.exports = app;