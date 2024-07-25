import {configDotenv} from "dotenv";
import app from "./app.js";

// DotEnv configrations
configDotenv({
    path: "./.env"
})

const port = process.env.PORT || 8000


app.listen(port, () => {
    console.log(`server listing on http://localhost:${port}`)
})