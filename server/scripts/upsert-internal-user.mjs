import "dotenv/config"
import bcrypt from "bcryptjs"
import prisma from "../src/lib/prisma.js"

const email = process.argv[2]?.trim()?.toLowerCase()
const fullName = process.argv[3]?.trim()
const role = process.argv[4]?.trim()?.toUpperCase()
const password = process.argv[5]

const allowedRoles = new Set(["ADMIN", "HOST", "SECURITY"])

if (!email || !fullName || !role) {
  console.error("Usage: node scripts/upsert-internal-user.mjs <email> <fullName> <role> [password]")
  process.exit(1)
}

if (!allowedRoles.has(role)) {
  console.error(`Invalid role: ${role}. Allowed roles: ADMIN, HOST, SECURITY`)
  process.exit(1)
}

try {
  const existingUser = await prisma.internalUser.findUnique({ where: { email } })
  const passwordHash = password ? await bcrypt.hash(password, 12) : null

  if (!existingUser && !passwordHash) {
    console.error("Password wajib diisi saat membuat internal user baru")
    process.exit(1)
  }

  const internalUser = existingUser
    ? await prisma.internalUser.update({
        where: { email },
        data: {
          fullName,
          role,
          isActive: true,
          ...(passwordHash ? { passwordHash } : {})
        }
      })
    : await prisma.internalUser.create({
        data: {
          email,
          fullName,
          role,
          isActive: true,
          passwordHash
        }
      })

  console.log(`Internal user ready: ${internalUser.email} (${internalUser.role})`)
} catch (error) {
  console.error("Failed to upsert internal user")
  console.error(error)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
