const express = require("express")
const app = express()
var routers = require("./routes/paths")
var cookieParser = require('cookie-parser');
app.use(cookieParser())
app.use(express.json())

app.use(routers)

app.listen(3000,()=>{
    console.log("port started >>>");
})