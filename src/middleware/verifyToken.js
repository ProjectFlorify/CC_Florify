const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: true, message: 'Authorization token is required' });

    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(500).json({ error: true, message: 'Invalid token' });
    }
};

module.exports = { verifyToken };
