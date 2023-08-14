import { ResponseError, ResponseSuccess } from "../../helper/Response.js";
import prisma from "../../utils/prisma.js";

export const getAllUserOrderController = async (req,res) => {
    try {
      const findAllOrder = await prisma.order.findMany({
         include: {
            orderDetail:true,
            user:true 
         }
      });

      return ResponseSuccess(res,`${findAllOrder.length} orders found` , 200 , findAllOrder);

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}