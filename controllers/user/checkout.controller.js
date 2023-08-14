import { ResponseError,ResponseSuccess } from "../../helper/Response.js";
import { validationResult } from 'express-validator';
import prisma from "../../utils/prisma.js";

export const checkoutController = async (req,res) => {
   const { name ,detail , country,city,address,phone,postalCode,orderDetail,payment,delivery } = req.body;
   const userId = Number(req.userId);
   const result  = validationResult(req.body);

   if(!result.isEmpty()) {
      return ResponseError(res,'please complete all field' , 400);
   }

   try {
      let ordersItem = [];

      for(let i = 0; i < orderDetail.length; i++) {
          ordersItem.push({
              productTitle:orderDetail[i].productTitle,
              productPrice:orderDetail[i].productPrice,
              productImage:orderDetail[i].productImage,
              qty:orderDetail[i].qty,
              total:orderDetail[i].total
          });
      }

      const createTransaction = await prisma.order.create({
          data: {
             country,
             city,
             address,
             phone,
             delivery,
             detail,
             paymentMethod:payment,
             orderDetail:{
                create:ordersItem
             }, 
             user: {
               connect:{
                  id:userId
               }
             }
          }
      });



      if(createTransaction) {
         for(let j = 0; j < orderDetail.length; j++) {
             const findProduct = await prisma.product.findUnique({
                where:{
                   id:orderDetail[j].id
                }
             });

             await prisma.product.update({
                where: {
                   id: Number(orderDetail[j].id)
                },
                data: {
                  stock: findProduct.stock - Number(orderDetail[j].qty)
                }
             });
             
            }
            
            return ResponseSuccess(res,'transaction complete!' , 200 , { payment:'success' });
      }

   } catch(err) {
      return ResponseError(res, err.message,500);
   }
}

export const getUserTransactionController = async (req,res) => {
   const userId = Number(req.userId);

   try {
      const findUserTransaction = await prisma.order.findMany({
          where: {
            user: {
               id:userId
            }
          },
          include: {
             orderDetail:true,
             user:true 
          }
      });

      return ResponseSuccess(res,`${findUserTransaction.length} transactions found` , 200 , findUserTransaction);

   } catch(err) {
      return ResponseError(res,err.message,500);
   }
}

export const getUserTransactionDetailController = async (req,res) => {
   const id = Number(req.params.id);

   try {
      const findDetailTransaction = await prisma.order.findUnique({
           where: {
            id:id 
           },
           include: {
            orderDetail:true,
            user:true
           }
      });

      if(!findDetailTransaction) {
         return ResponseError(res, 'transaction with this id is not found' , 400);
      }

      return ResponseSuccess(res,'1 transaction found' , 200 , findDetailTransaction);

   } catch(err) {
      return ResponseError(res,err.message,500);
   }
}