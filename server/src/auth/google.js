import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import prisma from "../lib/prisma.js"

function buildSessionUser(accountType, account) {
  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    role: accountType === "internal" ? account.role : "GUEST",
    accountType
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value

        if (!email) {
          return done(new Error("Google account does not provide an email address"))
        }

        const internalUser = await prisma.internalUser.findUnique({
          where: { email }
        })

        if (internalUser) {
          return done(null, buildSessionUser("internal", internalUser))
        }

        let user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              fullName: profile.displayName,
              authProvider: "GOOGLE",
              googleId: profile.id
            }
          })
        } else if (!user.googleId || user.fullName !== profile.displayName) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              fullName: profile.displayName,
              googleId: profile.id
            }
          })
        }

        return done(null, buildSessionUser("guest", user))
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    accountType: user.accountType
  })
})

passport.deserializeUser(async (sessionUser, done) => {
  try {
    if (!sessionUser?.id || !sessionUser?.accountType) {
      return done(null, false)
    }

    if (sessionUser.accountType === "internal") {
      const internalUser = await prisma.internalUser.findUnique({
        where: { id: sessionUser.id }
      })

      if (!internalUser || !internalUser.isActive) {
        return done(null, false)
      }

      return done(null, buildSessionUser("internal", internalUser))
    }

    const guestUser = await prisma.user.findUnique({
      where: { id: sessionUser.id }
    })

    if (!guestUser) {
      return done(null, false)
    }

    return done(null, buildSessionUser("guest", guestUser))
  } catch (error) {
    return done(error)
  }
})