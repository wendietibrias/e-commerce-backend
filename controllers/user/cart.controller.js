import { ResponseError,ResponseSuccess } from "../../helper/Response.js"; 
import prisma from "../../utils/prisma.js";

export const addCartController = async (req,res) => {
    const { productTitle,productPrice,productImage,qty,total } = req.body;
    const userId = Number(req.userId);

    try {
      const addProductToCart = await prisma.cart.create({
          data: {
             productTitle,
             productPrice,
             productImage,
             qty,
             total,
             user: {
                connect:{
                    id:userId
                }
             } 
          }
      });

      return ResponseSuccess(res,'product already add to cart' , 200 , addProductToCart);

    } catch(err) {
       return ResponseError(res,err.message,500);
    }
}

export const removeCartController = async (req,res) => {
    try {

    } catch(err) {
       return ResponseError(res,err.message,500);
    }
}

export const updateCartController = async (req,res) => {
    try {

    } catch(err) {
       return ResponseError(res,err.message,500);
    }
}