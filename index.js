const express = require('express')
const app = express()


app.listen(3001, console.log("¡Servidor encendido!"))


app.get("/home", (req, res) => {
res.send("Hello World Express Js")
})