import { ResponseError, ResponseSuccess } from "../../helper/Response.js";
import { findAdminById } from "../../utils/querydb.js";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import prisma from "../../utils/prisma.js";     

export const getAdminProfileController = async (req,res) => {
    const adminId = Number(req.adminId);

    try {
      const findAdminAccount = await findAdminById(adminId);
      return ResponseSuccess(res,"profile found" , 200,findAdminAccount);

    } catch(err) {
       return ResponseError(res,err.message,500);
    }
}

export const updateProfileController = async (req,res) => {
    const { name,email,bio,address,phone,country,city } = req.body;
    const adminId = req.adminId;

    //field validation 
    const result = validationResult(req);

    if(!result.isEmpty()) {
      return ResponseError(res,result.errors,400);
    }

    try {
       //check if admin profile exists , if not create it
       const findAdminAccount = await findAdminById(Number(adminId));
 
       let actionProfile = null;
       if(!findAdminAccount.profile) {
           actionProfile = await prisma.profileAdmin.create({
             data: {
                bio,
                address, 
                phone,
                country,
                city,
                admin: {
                   connect: {
                      id:findAdminAccount.id
                   }
                }
             },
           });

       }

       //update the profile if it exists
       actionProfile = await prisma.profileAdmin.update({ 
         where: {
            id:findAdminAccount.profile.id
         },
         data: {
            bio,
            address,
            phone,
            country,
            city
         }
       });

       const updateAdminAccount = await prisma.admin.update({
          where:{
            id:findAdminAccount.id 
          },
          data: {
            name,
            email
          }
       });

       const newToken =  jwt.sign({ name:findAdminAccount.name,email:findAdminAccount.email,role:findAdminAccount.role }, `${process.env.JWT_AUTH_SECRET}`, { algorithm:"HS384",expiresIn:"1d" });

       if(actionProfile && updateAdminAccount) {
          return ResponseSuccess(res,"profile updated" , 200 , { access_token:newToken });
       }

    } catch(err) {
       ResponseError(res,err.message,500);
    }
}

export const updateAdminAvatar = async (req,res) => {
    try {

    } catch(err) {

    }
}