require('dotenv').config()
const express = require("express");
const userRouter = require("./routers/user");

const app = express();
const port = process.env.PORT || 3001;

app.use("/users", userRouter);

app.listen(port, () => {
console.log(`Servidor rodando na porta ${port}...`);
});