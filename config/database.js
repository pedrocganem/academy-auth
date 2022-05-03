const mongoose = require("mongoose");

require("dotenv").config();

const { MONGODB_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGODB_URI, {
    })
        .then(() => {
            console.log("connected to database");
        }
        ).catch((error) => {
            console.log("database connection failed");
            console.log(error);
            process.exit(1);
        });
}