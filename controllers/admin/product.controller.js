import { ResponseError, ResponseSuccess } from "../../helper/Response.js";
import { validationResult } from "express-validator";
import { v2 } from "cloudinary";
import prisma from "../../utils/prisma.js";

export const getAllProductController = async (req,res) => {
    const searchQuery = req.query.category;

    try {
        if(searchQuery && searchQuery !== "" && searchQuery !== "null") {
            const findProductByCategory = await prisma.product.findMany({
                 where: {
                    category:{
                        slug:{
                            contains:searchQuery
                        }
                    }
                 },
                 take:12,
                 skip:0,
                 include:{
                    productImage:true,
                    category:true,
                    admin:true
                 }
            });

           return ResponseSuccess(res,`${findProductByCategory.length} products found` , 200 , findProductByCategory);
        }

        const allProduct = await prisma.product.findMany({
            include:{
                admin:true,
                category:true,
                productImage:true
            },
            take:12,
            skip:0
        });
        
        return ResponseSuccess(res,`${allProduct.length} products found` , 200 , allProduct);

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

export const getProductController = async (req,res) => {
     try {
        const id = Number(req.params.id);
        const findProduct = await prisma.product.findUnique({
            where: {
                id:id 
            },
            include: {
                productImage:true,
                category:true
            }
        });

        if(!findProduct) return ResponseError(res,"product is not found",400);

        return ResponseSuccess(res,`1 product found` , 200,findProduct);

     } catch(err) {
        return ResponseError(res,err.message,500);
     }
}

export const createProductController = async (req,res) => { 

    //field validation
    // const result = validationResult(req);
    // if(!result.isEmpty()){
    //     return ResponseError(res,result.errors,400);
    // }

    const { title,category,price,description,excerpt,stock } = req.body;
    const productImage = req.file;
    const adminId = req.adminId;

    try {
        //upload image to cloudinary
        const uploadProductImage = await v2.uploader.upload(productImage.path, { folder:"product-image" });
        const findAdminAccount = await prisma.admin.findUnique({
            where:{ id:Number(adminId) }
        });
        const findCategory = await prisma.category.findUnique({
             where: { id:Number(category) }
        });
        
        if(uploadProductImage) {
            const createProduct = await prisma.product.create({
                 data: {
                    title,
                    description,
                    excerpt,
                    price:Number(price),
                    stock:Number(stock),
                    admin:{
                        connect: {
                            id:findAdminAccount.id
                        }
                    },
                    category:{
                        connect:{
                            id:findCategory.id
                        }
                    },
                    productImage: {
                        create: {
                            publicId:uploadProductImage.public_id,
                            url:uploadProductImage.url
                        }
                    }
                 }
            });

            if(createProduct) {
                return ResponseSuccess(res,'product added' , 200,createProduct);
            }
        }
      
    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

export const deleteProductController = async (req,res) => {
    const productId = Number(req.params.id);

    try {
        //find product by product id
        const findProduct = await prisma.product.findUnique({
            where: {
              id:productId 
            },
            include: {
                productImage:true
            }
        });

        const destoryImageCloudinary = await v2.uploader.destroy(findProduct.productImage.publicId);
        if(destoryImageCloudinary) {
            const deleteProduct = await prisma.product.delete({
                 where: {
                    id:productId,
                 },
            });
            if(deleteProduct) {
               return ResponseSuccess(res,'product already delete' , 200,deleteProduct);
            }
        }


    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

export const updateProductController = async (req,res) => {
    const { title,category,price,description,excerpt,stock,recommended } = req.body;
    const fileImage = req.file;
    const productId = Number(req.params.id);

    try {
       const findProduct = await prisma.product.findUnique({
         where: {
             id:productId
         },
         include:{
            productImage:true,
         }
       });

       let uploadProductImage = null;

       //check if image provide
       if(fileImage) {
          //destroy image in cloudinary and upload new image
          await v2.uploader.destroy(findProduct.productImage.publicId);
          uploadProductImage = await v2.uploader.upload(fileImage.path,{
             folder:"product-image"
          });
       }
 
          //update product
           const updateProduct = await prisma.product.update({
              where: {
                 id:productId
              },
              data: {
                 title,
                 description,
                 excerpt,
                 stock:Number(stock),
                 price:Number(price),
                 recommended: recommended === 'false' ? false : true,
                 category: {
                    connect:{
                        id:Number(category)
                    }
                 },
                 productImage: {
                   update: {
                     publicId:uploadProductImage ? uploadProductImage.public_id : findProduct.productImage.publicId,
                     url:uploadProductImage ? uploadProductImage.url : findProduct.productImage.url
                   }
                 }
              }
           });
    
           if(updateProduct) {
            return ResponseSuccess(res,'product updated' , 200,updateProduct);
           }
   

    } catch(err) {
        return ResponseError(res,err.message,500);
    }
}

