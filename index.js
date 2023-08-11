import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import cloudinary from "cloudinary";
import { fileURLToPath } from 'url';
import { AuthRoutes,BannerUserRoutes, ProductUserRoutes,CartRoutes } from "./routes/user/index.js";
import { 
    AuthAdminRoutes,
    CategoryRoutes,
    ProductRoutes,
    ProfileRoutes ,
    DashboardRoutes,
    BannerRoutes
} from "./routes/admin/index.js";

dotenv.config({ debug:false });

//constant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.SERVER_PORT || 8080;


//use 
app.use(express.json({ limit:"3mb" }));
app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE","PUT"]
}));
app.use('/banner', express.static(path.join(__dirname, '/assets/banners')));

//cloudinary config
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true
});

//routing for user
app.use("/api/user/auth",AuthRoutes);
app.use("/api/user/banner" , BannerUserRoutes);
app.use("/api/user/product", ProductUserRoutes);
app.use("/api/user/cart",CartRoutes);

//routing for admin
app.use("/api/admin/dashboard" , DashboardRoutes);
app.use("/api/admin/auth",AuthAdminRoutes);
app.use("/api/admin/category",CategoryRoutes);
app.use("/api/admin/product",ProductRoutes);
app.use("/api/admin/profile" , ProfileRoutes);
app.use("/api/admin/banner",BannerRoutes);

//run server
app.listen(port , () => console.log(`run on port : ${port}`));