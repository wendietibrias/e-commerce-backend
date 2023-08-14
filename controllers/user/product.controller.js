import prisma from "../../utils/prisma.js";
import { ResponseError, ResponseSuccess } from "../../helper/Response.js";

export const getAllProductController = async (req,res) => {
    const { recommended,take,category,page,allPage } = req.query;

    try {
      if(category && category !== "null") {
          const findProductByCategory = await prisma.product.findMany({
             where: {
                category: {
                   slug:{
                      contains:category
                   }
                }
             },
             take:12,
             include: {
               productImage:true,
               category:true 
             }
          });

          return ResponseSuccess(res,`${findProductByCategory.length} products found` , 200 , findProductByCategory);
      }

      if(recommended) {
          const findRecommendedProduct = await prisma.product.findMany({
             where: {
               recommended:true
             },
            include: {
              category:true, 
              productImage:true
            },
            take:Number(take),
            skip:0,
            orderBy:{
              createdAt:'desc'
            }
          });

          return ResponseSuccess(res,'reccomended products' , 200 , findRecommendedProduct);
      }

      const findAllProduct = await prisma.product.findMany({
          include: {
            category:true, 
            productImage:true
          },
          take:Number(take),
          skip:0,
          orderBy:{
            createdAt:'desc'
          }
      });

      return ResponseSuccess(res,`${findAllProduct.length} products found in page 1` , 200 , findAllProduct);

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

export const getProductController = async (req,res) => {
    const id = Number(req.params.id);

    try {
       const findProduct = await prisma.product.findUnique({
         where: {
            id:id 
         },

         include: {
            category:true,
            productImage:true
         },
       });

       return ResponseSuccess(res, 'product detail found' , 200 , findProduct);

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}


export const getProductCategoriesController = async (req,res) => {
    try {
      const categoriesProduct = await prisma.category.findMany();
      return ResponseSuccess(res,'category found' , 200 , categoriesProduct);

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}