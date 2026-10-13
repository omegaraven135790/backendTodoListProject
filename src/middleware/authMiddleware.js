import jwt from "jsonwebtoken";
import db from "../db.js";


function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({ message: "Failed to authenticate token" });
        }

        const user = db.prepare(`SELECT id FROM users WHERE id = ?`).get(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }

        req.userId = decoded.id;
        next();

    });

}

export default authMiddleware;