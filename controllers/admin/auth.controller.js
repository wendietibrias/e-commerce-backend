import { validationResult } from "express-validator";
import { ResponseError, ResponseSuccess } from "../../helper/Response.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma.js";

const salt = Number(process.env.BCRYPT_SALT);

export const loginController = async (req,res) => {
    const { email,name,password } = req.body;
    const result = validationResult(req);

    //field validation
    if(!result.isEmpty()) {
        return ResponseError(res,result.errors,400);
    }

    try {
      //check admin account is exists
      const findAdminAccount = await prisma.admin.findUnique({
         where:{
            email:email,
            name:name
         }
      });
      if(!findAdminAccount) {
         return ResponseError(res,"account is not found" , 400);
      }

      //check password matching
      const comparePassword = bcrypt.compare(password,findAdminAccount.password);
      if(!comparePassword) {
         return ResponseError(res,"invalid password or username" , 401);
      }

      //check if the account is admin 
      if(findAdminAccount.role === 'USER') {
         return ResponseError(res,"this account doesn'nt have access for this route" , 401);
      }

      //generate token for admin
      const generateToken = jwt.sign({ email:findAdminAccount.email,name:findAdminAccount.name,role:findAdminAccount.role } , process.env.JWT_AUTH_SECRET,{ algorithm:"HS384" });
      return ResponseSuccess(res,"token generate", 200, { access_token:generateToken });

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

export const registerController = async (req,res) => {
    const { email,name,password } = req.body;
    const result = validationResult(req);

    //field validation
    if(!result.isEmpty()) {
        return ResponseError(res,result.errors,400);
    }

    try {
       const saltRounds =  await bcrypt.genSalt(salt);
       const hashPassword = await bcrypt.hash(password,saltRounds);

       const createAdmin = await prisma.admin.create({
          data: {
             name,
             email,
             password:hashPassword
          }
       });

       if(createAdmin) {
          return ResponseSuccess(res,'success add account' , 200 , createAdmin);
       }

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}