import { ResponseError, ResponseSuccess } from "../../helper/Response.js";
import prisma from "../../utils/prisma.js";

export const getAllBanner = async (req,res) => {
    try {
      const allBanner = await prisma.banner.findMany();
      return ResponseSuccess(res, 'banner found' , 200 , allBanner);

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}