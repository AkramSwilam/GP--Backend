import { connectDB } from "./database/connection.js"
import { categoriesRouter } from "./modules/categories/categories.routes.js"
import {stocksRouter} from "./modules/stocks/stocks.routes.js"
import { usersRouter } from "./modules/users/users.routes.js"
import { globalErrorHandler } from "./utils/error_handling.js"

export const bootstrap=(app)=>{
connectDB()

app.use("/api/v1/users",usersRouter)
app.use('/api/v1/categories',categoriesRouter)
app.use("/api/v1/stocks",stocksRouter)

app.use(globalErrorHandler)
app.use("*",(req,res,nxt)=>{
    return res.status(404).json({"message":"404 Not Found"})
})
}