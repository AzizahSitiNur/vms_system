import express from "express"
import passport from "passport"
import bcrypt from "bcryptjs"
import prisma from "../lib/prisma.js"

const router = express.Router()
const STAFF_ROLES = new Set(["ADMIN", "HOST", "SECURITY"])

function getFrontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:3000"
}

function getRoleHome(role) {
  if (role === "ADMIN") return "/admin"
  if (role === "SECURITY") return "/security"
  if (role === "HOST") return "/host"
  return "/dashboard"
}

function setAuthFlash(req, code) {
  req.session.authFlash = code
}

function getAuthFlashMessage(code) {
  if (code === "google-login-failed") return "Login Google gagal. Coba lagi."
  if (code === "use-email-login") return "Gunakan login email untuk akun ini."
  return ""
}

async function logoutUser(req) {
  await new Promise((resolve, reject) => {
    req.logout((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

router.post("/login", async (req, res) => {
  try {
    const email = req.body?.email?.trim()?.toLowerCase()
    const password = req.body?.password

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Email atau password salah" })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return res.status(401).json({ message: "Email atau password salah" })
    }

    if (!STAFF_ROLES.has(user.role)) {
      return res.status(403).json({ message: "Akun ini tidak bisa login dengan metode ini" })
    }

    req.login(user, (error) => {
      if (error) {
        return res.status(500).json({ message: "Gagal membuat sesi login" })
      }

      return res.json({
        message: "Login berhasil",
        redirectTo: getRoleHome(user.role)
      })
    })
  } catch {
    return res.status(500).json({ message: "Terjadi kesalahan di server" })
  }
})

router.get(
  "/google/guest",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
)

router.get("/google", (req, res) => {
  return res.redirect("/auth/google/guest")
})

router.get("/flash", (req, res) => {
  const code = req.session.authFlash || ""
  delete req.session.authFlash

  return res.json({
    code,
    message: getAuthFlashMessage(code)
  })
})

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", async (error, user) => {
      const frontendUrl = getFrontendUrl()

      if (error || !user) {
        setAuthFlash(req, "google-login-failed")
        return res.redirect(frontendUrl)
      }

      if (STAFF_ROLES.has(user.role)) {
        setAuthFlash(req, "use-email-login")
        return res.redirect(frontendUrl)
      }

      req.login(user, (loginError) => {
        if (loginError) {
          setAuthFlash(req, "google-login-failed")
          return res.redirect(frontendUrl)
        }

        return res.redirect(`${frontendUrl}${getRoleHome(user.role)}`)
      })
    })(req, res, next)
  }
)

export default router