import express from "express"

const router = express.Router()

router.get("/me", async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  return res.json(req.user)
})

export default router