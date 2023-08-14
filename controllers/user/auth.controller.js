import { ResponseError,ResponseSuccess } from "../../helper/Response.js";
import { validationResult } from "express-validator";
import { findUserByEmail } from "../../utils/querydb.js";
import prisma from "../../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../../utils/transporter.js";

const saltRounds = Number(process.env.SALT) || 10;

export const loginController = async (req,res) => {
   const { email,password } = req.body;
   
   try {
     const result = validationResult(req);
  
     if(!result.isEmpty()) {
        return ResponseError(res,result.errors , 400);
     }

     //check if user exists
     const findUser = await findUserByEmail(email);
     if(!findUser) {
       return ResponseError(res,'account is not found',500);
     }

    //  check email_verified user
     if(!findUser.email_verified) {
       return ResponseError(res,"account is not active yet",400);
     }

     //compare password
     const checkPassword = await bcrypt.compare(password,findUser.password);
     if(!checkPassword) {
        return ResponseError(res,"invalid password or email", 400);
     }

     //generate token jwt for user
     const generateToken = jwt.sign({ email:findUser?.email,name:findUser?.name,role:findUser?.role } , process.env.JWT_AUTH_SECRET , { expiresIn:"1d",algorithm:"HS384" });
     if(generateToken) {
        return ResponseSuccess(res,"token generated", 200,{ access_token:generateToken });
     }

   } catch(err) {
      return ResponseError(res,err.message,500);
   }
}

export const registerController = async (req,res) => {
    const { email,password,name,confirm } = req.body;

    try {
      //check if user exists
      const findUser = await findUserByEmail(email);
      if(findUser) {
         return ResponseError(res,"account is already exists" , 400);
      }

      //check password match confirm password
      if(password !== confirm) {
         return ResponseError(res,"password is not match" , 400);
      }

      //hashing password
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
 
      if(hash) {
        const createUser = await prisma.user.create({
            data: {
               email,
               name,
               password:hash 
            }
        });

        if(createUser) {
         //send account confirmation link to user gmail
           const confirmation_token =  jwt.sign({ email:createUser?.email }, process.env.JWT_AUTH_SECRET,{ algorithm:"HS384",expiresIn:"1h" });

           const info = await transporter.sendMail({
              from:process.env.SENDMAIL_SENDER_ADDRESS,
              to:createUser.email,
              subject:"ShopMart account verification",
              text:"test verification",
              html:`<a href="http://localhost:8080/api/user/auth/email-verification?confirmation_token=${confirmation_token}">Make your account active</a>`
           });

           if(info.messageId) {
              return ResponseSuccess(res,"Account success ,please verify your account first",200);
           }
        }
      
      }

    } catch(err) {
      return ResponseError(res,err.message,500);
    }
}

export const emailVerificationController = async (req,res) => {
   const { confirmation_token } = req.query;

   //field validation
   const result = validationResult(req);
   if(!result.isEmpty()) {
      return ResponseError(res,result.errors,400);
   }

   try {
      
      const verifyToken = jwt.verify(confirmation_token,process.env.JWT_AUTH_SECRET,{ algorithms:["HS384"] });
      if(!verifyToken) {
          return ResponseError(res,"Unauthorize request" , 403);
      }

      //check if token email is synchronize with email in database
      const findUser = await findUserByEmail(verifyToken.email);
      if(!findUser) {
          return ResponseError(res,"Invalid token payload" , 403);
      }

      if(findUser.email_verified === true) {
          return ResponseError(res,"Email is already active", 405);
      }

      //update user 
      const updateUserVerified = await prisma.user.update({
          where:{  
            email:findUser.email
          },
          data: {
             email_verified:true
          }
      });

      if(updateUserVerified) {
          return res.redirect(`http://localhost:3006/auth`);
      }

   } catch(err) {
      return ResponseError(res,err.message,500);
   }
}

export const resendEmailVerificationController = async (req,res) => {
    const { email } = req.body;

    //field validation 
    const result = validationResult(req.body);

    if(!result.isEmpty()) {
      return ResponseError(res,'please complete the field' , 400);
    }

    try {
      const findUser = await prisma.user.findUnique({
          where: {
            email:email
          }
      });

      if(!findUser) return ResponseError(res,'account is not found' , 400);

      if(findUser && findUser.email_verified == false) {
           const info = await transporter.sendMail({
              from:process.env.SENDMAIL_SENDER_ADDRESS,
              to:findUser.email,
              subject:"ShopMart account verification",
              text:"test verification",
              html:`<a href="http://localhost:8080/api/user/auth/email-verification?confirmation_token=${confirmation_token}">Make your account active</a>`
           });

            if(info.messageId) {
              return ResponseSuccess(res,'email verification resend success' , 200 , null);
           }
      }

      return ResponseSuccess(res,'account already verified' , 200,null);

    } catch(err) {
       return ResponseError(res,err.message,500);
    }
}
