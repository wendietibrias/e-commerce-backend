import { ResponseError } from "../helper/Response.js";
import { findUserByEmail } from "../utils/querydb.js";
import prisma from "../utils/prisma.js";
import jwt from "jsonwebtoken";

const AuthorizeAdminMiddleware = async (req,res,next) => {
    const headers = req.headers.authorization;

    if(!headers) {
        return ResponseError(res,"Unauthorized" , 401);
    }

     try {
        //verify and decode token
        const token = headers.split(" ")[1];
        const verifyToken = jwt.verify(token,process.env.JWT_AUTH_SECRET, { algorithms:["HS384"] });
 

        if(!verifyToken) {
           return ResponseError(res,"Invalid token" , 401);
        }

        if(verifyToken.role == 'ADMIN' || verifyToken.role == 'SUPERADMIN') {
           //check if the email in token is valid email
           const findAdminAccount = await prisma.admin.findUnique({
                 where:{
                    email:verifyToken.email
                 }
            });
    
            if(!findAdminAccount) {
               return ResponseError(res,"Invalid token payload" , 401);
            }
    
            req.adminId = findAdminAccount.id;
            return next();
        }

       return ResponseError(res,"sorry this page is just for admin",400);

     } catch(err) {
        return ResponseError(res,err.message,500);
     }
}

export default AuthorizeAdminMiddleware;