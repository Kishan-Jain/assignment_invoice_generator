import { Router } from "express";
import { createInvoice } from "../controllers/invoice.controller.js"

const mainRouter = Router()

mainRouter.route("/createinvoice").post(createInvoice)


export default mainRouter