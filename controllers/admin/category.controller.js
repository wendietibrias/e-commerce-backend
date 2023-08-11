import { ResponseError, ResponseSuccess } from "../../helper/Response.js";
import { validationResult } from "express-validator";
import prisma from "../../utils/prisma.js";

export const getAllCategoryController = async (req,res) => {

    try {
       const findAllCategory = await prisma.category.findMany({
           include: {
              products:true,
              admin:true
           }
       });
       return ResponseSuccess(res, `${findAllCategory.length} category founds` , 200 , findAllCategory);
    } catch(err) {
        ResponseError(res,err.message,500);
    }

}

export const createCategoryController = async (req,res) => {
    const { title,slug } = req.body;
    
    //field validatoin
    const result = validationResult(req);
    if(!result.isEmpty()) {
        return ResponseError(res,result.errors, 400);
    }

    try {

        //create category
        const adminId = req.adminId;
        const createCategory = await prisma.category.create({
             data: {
                title,
                slug ,
                adminId
             }
        });

        if(createCategory) {
            return ResponseSuccess(res,"success create category",200,null);
        }

    } catch(err) {
        ResponseError(res,err.message,500);
    }

}

export const deleteCategoryController = async (req,res) => {
    //param validatoin
    const result  = validationResult(req);

    if(!result.isEmpty()) {
        return ResponseError(res,result.errors,400);
    }
    
    try {
        const categoryId = Number(req.params.id);

        //check if category match with the params id
        const findCategory = await prisma.category.findUnique({
             where: {
                id:categoryId
             }
        });
        if(!findCategory) {
            return ResponseError(res,"category with id : " + categoryId + " is not found" , 400);
        }

        //delete category
        const deleteCategory = await prisma.category.delete({
             where:{
                id:categoryId
             }
        });
        if(deleteCategory) {
            return ResponseSuccess(res,"success delete category" , 200,deleteCategory);
        }

    } catch(err) {
        ResponseError(res,err.message,500);
    }

}

export const updateCategoryController = async (req,res) => {
    const { title,slug } = req.body;
    
    //field validatoin
    const result = validationResult(req);
    if(!result.isEmpty()) {
        return ResponseError(res,result.errors, 400);
    }

    try {
      //check if id match with category in db
      const categoryId = Number(req.params.id);
      const findCategory = await prisma.category.findUnique({
         where: {
            id:categoryId
         }
      });
      if(!findCategory) {
        return ResponseError(res,"category with id : " + categoryId + " is not found" , 400);
      }

      //update category
      const updateCategory = await prisma.category.update({
         where: {
            id:categoryId
         },
         data: {
            title,
            slug
         }
      });

      if(updateCategory) {
        return ResponseSuccess(res,"success update category" , 200,updateCategory);
      }
 
    } catch(err) {
        ResponseError(res,err.message,500);
    }

}
