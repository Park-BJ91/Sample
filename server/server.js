// import express, { json } from "express";
import express, { json } from "express";
import ProductRoutes from "./src/routes/productRoutes.js";
import UserRoutes from "./src/routes/userRoutes.js";
import dotenv from 'dotenv';
import './src/passport/naverAuth.js';
import './src/passport/localAuth.js';
import passport from "passport";
import cors from "cors";



// import testApp from './testApp.js';


dotenv.config();
const app = express()
const PORT = process.env.PORT || 8080;

app.use(json());
app.use(passport.initialize());
app.use(ProductRoutes);
app.use(UserRoutes);

app.use(cors());

// app.use(cors({
//     origin: "http://localhost:3000", // 허용할 도메인
//     methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
//     credentials: false // 쿠키 허용 여부
// }));


app.get("/api/test", (req, res) => {
    console.log("API GET ....!!!! ");
    res.json({ message: "Server API TEST MESSAGE" });
});



// testApp.listen(testApp.get('port'), () => {
//     console.log(`Server Running on http://localhost:${testApp.get('port')}`);
// });

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});


