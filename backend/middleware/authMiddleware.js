const jwt = require('jsonwebtoken')
const BlacklistedToken = require('../models/BlacklistedToken')

const JWT_SECRET = process.env.JWT_SECRET

module.exports = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    const blacklistedToken = await BlacklistedToken.findOne({ token })
    if (blacklistedToken) {
        return res.status(401).json({
            success: false,
            message: 'Token is blacklisted'
        })
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        })
    }
}
