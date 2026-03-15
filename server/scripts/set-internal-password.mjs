import "dotenv/config"
import bcrypt from "bcryptjs"
import prisma from "../src/lib/prisma.js"

const email = process.argv[2]?.trim()?.toLowerCase()
const password = process.argv[3]

if (!email || !password) {
  console.error("Usage: node scripts/set-internal-password.mjs <email> <password>")
  process.exit(1)
}

const allowedRoles = new Set(["ADMIN", "HOST", "SECURITY"])

try {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    console.error(`User not found: ${email}`)
    process.exit(1)
  }

  if (!allowedRoles.has(user.role)) {
    console.error(`Rejected: role ${user.role} is not allowed for internal password login`)
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { email },
    data: { passwordHash }
  })

  console.log(`Password updated for ${email} (${user.role})`)
} catch (error) {
  console.error("Failed to set internal password")
  console.error(error)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
