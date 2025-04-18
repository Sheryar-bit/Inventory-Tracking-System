const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const prisma = require('../db/db_config');
const logAudit = require('../middleware/AuditLogger');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;


//Registring a user:

const register = async function(req, res){
    try{
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword
        },
        select:{
            id: true,
            username: true            
        }
    });
    const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1h'})

    await logAudit('USER_REGISTRATION', user.id, {
        username,
        timestamp: new Date().toISOString(),
    });
    res.status(201).json({message: "User created Succesfully! ", token, user})
    }
    
    
    catch(err) {
        console.log(err)
        if (err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }
        return res.status(500).json({ message: "Failed to create user" });
    }
}


//user login:
const login = async function(req, res){
    try{
        const {username, password} = req.body;
        const user = await prisma.user.findUnique({
            where: {username}
        });
        
        if(!user){
            return res.status(401).json({message: "Invalid email or password"})
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1h'})

        await logAudit('USER_LOGIN_SUCCESS', user.id, {
            username,
            timestamp: new Date().toISOString(),
            ip: req.ip, //will cpture the IP address
        });

        res.status(200).json({message: "Login Succesfull! ", token, user})


    }catch(err){
        console.log(err)
        return res.status(500).json({ message: "Failed to login" });
    }
}

module.exports={
    register,
    login
}