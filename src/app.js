const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/accounts.routes")
const transactionRoutes = require("./routes/transaction.routes")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/transactions", transactionRoutes);
app.get("/",(req, res) =>{
    res.send("Ledger Service is up and Running ")
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
module.exports = app  