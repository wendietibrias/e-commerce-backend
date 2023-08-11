import jwt from "jsonwebtoken";
import { ResponseError } from "../helper/Response.js";

export const RoleGuard = async (req,res,next) => {
    const headersToken = req.headers.authorization;
    const token = headersToken.split(" ")[1];

    try {
      const verifyToken = jwt.verify(token, `${process.env.JWT_AUTH_SECRET}`, { algorithms:['HS384'] });
      if(verifyToken.role === "SUPERADMIN") {
         return next();
      }

      return ResponseError(res,"sorry you doesn't have permission to access this route",405);

    } catch(err) {
       return ResponseError(res,err.message,500);
    }
}