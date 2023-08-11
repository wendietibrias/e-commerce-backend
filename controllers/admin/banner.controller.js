import prisma from "../../utils/prisma.js"
import path from 'path';
import fs from 'fs';
import { ResponseError, ResponseSuccess } from "../../helper/Response.js";
import { validationResult } from 'express-validator';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllBannerController = async (req,res) => {
    try {
      const allBanner = await prisma.banner.findMany();
      return ResponseSuccess(res, `${allBanner.length} found` ,200 ,allBanner);

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

export const createBannerController = async (req,res) => {
    //field validation
    const { title,subtitle } = req.body;
    const result = validationResult(req.body);
    if(!result.isEmpty()) {
        return ResponseError(res,'Complete all provided field',400);
    }

    try {
       const bannerImage = req.file;
       const createBanner = await prisma.banner.create({
         data: {
            title,
            subtitle:subtitle,
            bannerImage:bannerImage.filename
         }
       });

       if(createBanner) {
         return ResponseSuccess(res,'success add banner' , 200 , createBanner);
       }

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

export const deleteBannerController = async (req,res) => {
    const id = Number(req.params.id);

    try {
      const findBanner = await prisma.banner.findUnique({
        where: {
            id 
        }
      });

      if(!findBanner) return ResponseError(res, 'banner with id : ' + id + ' not found' , 400);

      const path = __dirname + '/assets/banners/' + findBanner.bannerImage;
      const checkPath = fs.existsSync(path);

      if(checkPath) {
        fs.unlinkSync(path);
      }

      const deleteBanner = await prisma.banner.delete({
        where:{
            id:id
        }
      });

      if(deleteBanner) {
         return ResponseSuccess(res, 'success delete banner' , 200);
      }

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

export const updateBannerController = async (req,res) => {
    const { title,subtitle } = req.body;
    const id = Number(req.params.id);
    const bannerImage = req.file;

    //field validation
    const result = validationResult(req.body);
    if(!result.isEmpty()) {
        return ResponseError(res,'Complete all provided field',400);
    }

    try {
        const findBanner = await prisma.banner.findUnique({
             where: {
                id:Number(id)
             },
        });

        const path = __dirname + '/assets/banners/' + findBanner?.bannerImage;
        const checkPath = fs.existsSync(path);

        if(bannerImage && checkPath){
            if(checkPath) {
                fs.unlinkSync(path);
            }
        }

        const updateBanner = await prisma.banner.update({
             where:{
                id:Number(id)
             },
             data: {
                title,
                subtitle:subtitle,
                bannerImage:bannerImage ? bannerImage.filename : findBanner?.bannerImage
             }
        });

        if(updateBanner) {
            return ResponseSuccess(res,'banner updated' , 200 , null);
        }

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}