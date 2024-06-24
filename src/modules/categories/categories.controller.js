import { Category } from "../../database/models/category.js";
import { Stock } from "../../database/models/stock.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";


export const addCategory = crudOps.addModel(Category)

export const getCategories = crudOps.getAll(Category)

export const getCategory = crudOps.getOne(Category)

export const updateCategory = crudOps.updateModel(Category)

export const deleteCategory = crudOps.deleteModel(Category)


export const getCategoryStocks=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const docs=await Stock.find({categoryId:id})
        return res.status(200).json({message:"done",docs})
    }
)

