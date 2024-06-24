import { Router } from "express";
import * as categoriesController from "./categories.controller.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { appValidator } from "../../middelwares/app.validation.js";
import { addCategoryValidation, getCategoryValidation, updateCategoryValidation } from "./categories.validation.js";
export const categoriesRouter=Router()

categoriesRouter.post("/",checkUserToken,allowedTo(['admin']),appValidator(addCategoryValidation),categoriesController.addCategory)

categoriesRouter.get("/",appValidator(getCategoryValidation),categoriesController.getCategories)

categoriesRouter.get("/stocks/:id",categoriesController.getCategoryStocks)

categoriesRouter.put("/update/:id",checkUserToken,allowedTo(['admin']),appValidator(updateCategoryValidation),categoriesController.updateCategory)

categoriesRouter.delete("/:id",checkUserToken,allowedTo(['admin']),categoriesController.deleteCategory)