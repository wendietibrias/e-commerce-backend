import { ResponseError } from "../helper/Response.js";
import { findUserByEmail } from "../utils/querydb.js";
import jwt from "jsonwebtoken";

const AuthorizeMiddleware = async (req,res,next) => {
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

        //check if the email in token is valid email
        const findUser = await findUserByEmail(verifyToken.email);
        if(!findUser) {
           return ResponseError(res,"Invalid token payload" , 401);
        }

        req.userId = findUser.id;
        next();

     } catch(err) {
        return ResponseError(res,err.message,500);
     }
}

export default AuthorizeMiddleware;