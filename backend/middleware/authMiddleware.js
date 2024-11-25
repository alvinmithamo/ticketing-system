const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) return res.status(401).json({ message: 'Access Denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    });
};

const authorizeRoles = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
    }
    next();
};

module.exports = { authenticateToken, authorizeRoles };