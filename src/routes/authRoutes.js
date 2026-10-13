import express from "express";
import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from '../prismaClient.js';


const router = express.Router();

// Register a new user
router.post('/register', async(req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const hashedPassword = bcrpyt.hashSync(password, 8);
       const User = await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
       }

       )

       const defaultTodo =  `Hello! this is your first todo!`;
       await prisma.todo.create({
        data: {
            user_id: User.id,
            task: defaultTodo
        }
       });

        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token});
    }
    catch (error) {
        console.log(error.message);
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: "Username is already registered" });
        }
        return res.status(503).json({ message: "Registration failed" });
    }
    
    });


router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    try{
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if(!user){
            return res.status(404).send({message: "User not found"});
        }

        const passwordIsValid = bcrpyt.compareSync(password, user.password);
        if(!passwordIsValid){
            return res.status(401).send({message: "Invalid password"});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.json({token});
    }
    catch (error) {
        console.log(error.message);
        return res.status(503).json({ message: "Login failed" });
    }});
    export default router;