import prisma from "../../utils/prisma.js";
import { ResponseError, ResponseSuccess } from '../../helper/Response.js';

export const dashboardController = async (req,res) => {
    try {
      const allProduct = await prisma.product.count();
      
      const statisticData = {}

      statisticData.products = allProduct;
      statisticData.revenue = 0;
      statisticData.orders = 0;

      return ResponseSuccess(res,"statistic data display" , 200 , statisticData);

    } catch(err) {
       ResponseError(res,err.message,500);
    }
}