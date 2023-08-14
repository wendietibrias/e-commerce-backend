import prisma from "../../utils/prisma.js";
import { ResponseError, ResponseSuccess } from '../../helper/Response.js';

export const dashboardController = async (req,res) => {
    try {
      const allProduct = await prisma.product.count();
      const allOrder = await prisma.order.count();
      const orderDetail = await prisma.orderDetail.findMany();
      
      const statisticData = {}

      statisticData.products = allProduct;
      statisticData.revenue = orderDetail.reduce((a , b) => a + b.total , 0);
      statisticData.orders = allOrder;

      return ResponseSuccess(res,"statistic data display" , 200 , statisticData);

    } catch(err) {
       ResponseError(res,err.message,500);
    }
}