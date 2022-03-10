import express from "express";
import { getComment, publishComment, deleteComment } from "../controllers/Comments.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
 
const router = express.Router();
 
router.post('/', publishComment);
router.get('/', verifyToken, getComment);
router.get('/token', refreshToken);
router.delete('/:id', verifyToken, deleteComment);
 
export default router;