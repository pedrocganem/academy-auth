const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token) {
        return res.status(403).send("A token is required for authentication. It should be a field called `x-access-token` on your headers. About headers: https://www.soapui.org/learn/api/understanding-rest-headers-and-parameters/#:~:text=HTTP%20Headers%20are%20an%20important,Request%20Authorization")
    }
    
    try {
        const decoded = jwt.verify(token, config.JWT_TOKEN);
        req.user = decoded;
    } catch(error) {
        return res.status(401).send("Your token is invalid or expired, please sign in again! ")
    }
    return next();
};

module.exports = verifyToken;