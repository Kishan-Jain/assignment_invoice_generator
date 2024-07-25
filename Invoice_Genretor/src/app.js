import express, { json, urlencoded } from "express";
import mainRouter from "./routes/invoice.routes.js";


const app = express();
app.use(json());
app.use(urlencoded({ extended: true, limit: "100kb" }));


app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("/static"))
app.use("/", mainRouter);

export default app;
