const jwt = require('jsonwebtoken');
const prisma = require('../db/db_config');
require('dotenv').config()

const JWT_SECRET =process.env.JWT_SECRET;

//Simple auth middleware
const authenticate = async function(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Just attach user ID
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;