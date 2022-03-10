import express from "express";
import { getPosts, publishPost, deletePost } from "../controllers/Posts.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
 
const router = express.Router();
 
router.post('/', publishPost);
router.get('/', verifyToken, getPosts);
router.get('/token', refreshToken);
router.delete('/:id', verifyToken, deletePost);
 
export default router;