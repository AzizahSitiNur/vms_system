import "dotenv/config"
import express from "express"
import cors from "cors"
import passport from "passport"
import session from "express-session"

import "./src/auth/google.js"
import authRoute from "./src/routes/authRoute.js"
import prisma from "./src/lib/prisma.js"
import roleRoute from "./src/routes/roleRoute.js"

const app = express()
const port = process.env.PORT
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"

const corsOptions = {
  origin: frontendUrl,
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth", authRoute)
app.use("/roles", roleRoute)
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})