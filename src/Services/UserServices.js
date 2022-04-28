const User = require('../models/UserModels')
const bcrypt = require('bcryptjs');
const auth = require('../helpers/jwt.js')


async function login({ username, password }) {
    const user = await User.findOne({username});


    if(bcrypt.compareSync(password, user.password)){
        const token = auth.generateAccessToken(username);

        return {...user.toJSON(), token}
    }
}

async function register(params){

    const user = new User(params)
    await user.save();
}

async function getById(id) {

    const user = await User.findById(id);
    return user.toJSON()
}

module.exports = {
    login,
    register,
    getById
};