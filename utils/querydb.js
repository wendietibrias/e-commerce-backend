import prisma from "./prisma.js";

export const findUserByEmail = async (email) => {
     if(typeof email === "string") {
         const findUser = await prisma.user.findUnique({
             where:{ email:email }
         });

         if(findUser) return findUser;

         return null;
     }
}

export const findUserById = async (id) => {
  if(typeof id === "number") {
         const findUser = await prisma.user.findUnique({
             where:{ id:id }
         });

         if(findUser) return findUser;

         return null;
     }
}

export const findAdminById = async (id) => {
     if(typeof id === 'number') {
        const findAdmin = await prisma.admin.findUnique({
             where: {
                id:id
             },
             include: {
                products:true,
                categories:true,
                profile:true
             }
        });

        if(findAdmin) return findAdmin;

        return null;
     }

     return null;
}