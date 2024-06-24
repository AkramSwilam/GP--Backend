
import { crudOps } from "../../utils/crud_ops.js";
import { Stock } from "../../database/models/stock.js";
import { asyncHandler } from "../../utils/error_handling.js";
import { Category } from "../../database/models/category.js";

export const addStock = asyncHandler(
    async (req, res, nxt) => {
        const category = await Category.findById(req.body.categoryId)
        if (!category) return res.status(400).json({ message: "category not found" })

        const doc = await Stock.create(req.body)
        if (!doc) return res.status(201).json({ message: `doc not created` })

        category.stocks.push(doc)
        await category.save()
        return res.json({ message: "done", doc })
    }
)
export const getStocks = crudOps.getAll(Stock)
export const getStock = crudOps.getOne(Stock)

export const uploadMedia = crudOps.uploadMedia(Stock)

export const updateOneFile = crudOps.updateOneInMedia(Stock, 'charts', 6)

export const updateStock = crudOps.updateModel(Stock)

export const deleteStock = crudOps.deleteModel(Stock)


export const getChartsForStock = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const { duration } = req.query
        let time=new Date()

        if (duration == '6m') {
            time.setMonth(time.getMonth() - 6);
        }

        if (duration == '1y') {
            time.setFullYear(time.getFullYear() - 1);
        }

        if(duration=='1w'){
            time.setHours(time.getHours()-(24*7))
        }

        const stock = await Stock.findById(id)
        if(!stock) return res.status(400).json({message:"wrong id"})
       

        let charts = []
        for (const chart of stock.charts) {
            if (new Date(chart.date) >= time) {
                charts.push(chart)
            }
        }

        return res.status(200).json({message:"done",charts})

    }
)