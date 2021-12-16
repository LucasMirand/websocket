const express = require("express")
let Socket = require('./utils/sockets')
let {Server: HttpServer} = require("http")
let path = require("path")
let app = express()
let httpserver = new HttpServer(app)
let socket = new Socket(httpserver)
const serverRoutes = require("./routes")

const PORT = 3000


socket.init()

//Settings
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./views"))

app.set("views", path.join(__dirname, "views"))
app.set("view engine","ejs")

serverRoutes(app)

let mensajes = []


httpserver.listen(PORT,()=>{
    console.log(`server escuchado http://localhost:${PORT}`)
})
