import express from "express"
import passport from "passport"

const router = express.Router()

function getFrontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:3000"
}

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${getFrontendUrl()}/?error=google-login-failed`
  }),
  (req, res) => {
    return res.redirect(`${getFrontendUrl()}/dashboard`)
  }
)

export default router