import { Router } from "express";
import * as validationSchemas from "./stocks.validation.js"
import {appValidator} from "../../middelwares/app.validation.js"
import { checkUserToken } from "../../middelwares/chcek_user_token.js";

import { allowedTo } from "../../middelwares/authorization.js";
import { multerUploader } from "../../utils/multer.js";
import { addStock, deleteStock, getChartsForStock, getStock, getStocks, updateOneFile, updateStock, uploadMedia } from "./stocks.controller.js";
export const stocksRouter = Router()

const fields=[
    {name:'logo',maxCount:1},
]
const types={
    logo:'image',
}

stocksRouter.post("/", checkUserToken,allowedTo(['admin']),appValidator(validationSchemas.addStockValidation),addStock)

stocksRouter.put("/uploadMedia/:id",checkUserToken,multerUploader('stocks',types).fields(fields),uploadMedia)

stocksRouter.patch("/updateMedia/:id",checkUserToken,multerUploader('stocks',{charts:'file',}).fields([{name:'charts',maxCount:6}]),updateOneFile)

stocksRouter.get("/", getStocks)

stocksRouter.get("/:id", getStock)



stocksRouter.put("/:id",checkUserToken,allowedTo(['admin']),appValidator(validationSchemas.updateStockValidation),updateStock)


const fields2=[
    {name:'charts',maxCount:1},
]
const types2={
    images:'file',
}


stocksRouter.patch("/update/charts/:id",checkUserToken,multerUploader('stocks',types2).fields(fields2),updateOneFile)





stocksRouter.delete("/:id",checkUserToken,allowedTo(['admin']),deleteStock)



stocksRouter.get("/charts/:id",getChartsForStock)
