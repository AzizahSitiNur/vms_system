import express from "express"
import prisma from "../lib/prisma.js"

const router = express.Router()

router.get("/me", async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  return res.json(user)
})

export default router