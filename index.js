import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
const port=5000
import express from "express"
import { bootstrap } from "./src/index.router.js"
// import { Server } from "socket.io"
// import { initIo, socketAuth } from "./src/utils/socket_server.js"
// import { Server } from "socket.io"
const app= express()




app.use('/uploads',express.static('uploads'))
app.use(express.json())
app.use(cors())
bootstrap(app)

const server=app.listen(port,()=>{
    console.log("Server is ON ",port);
})

// const io= initIo(server)

// io.on("connection",(socket)=>{
//     socket.on("socketAuth",async(authorization)=>{
//         const auth=await socketAuth(authorization,socket.id)
//         if(auth==true){
//             socket.emit("socketAuth","done")
//         }
//     })
// })
