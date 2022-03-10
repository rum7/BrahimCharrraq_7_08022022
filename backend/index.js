import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import postRouter from "./routes/postRoute.js";
import commentRouter from "./routes/commentRoute.js";
dotenv.config();

const app = express();
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
 
app.use(express.static('public'));

app.listen(5000, () => {
    console.log('Server running at port 5000');
});

// app.listen(5000, () => {
//     console.log('Server running at port 5000');
// });  

// db.sequelize.sync().then(() => {
  
// })