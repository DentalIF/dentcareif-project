const bcrypt = require('bcrypt')
const prisma = require('../src/config/prisma')

async function main() {
  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      email: 'admin@dentcare.ua',
    },
  })

  if (existingAdmin) {
    console.log('Admin already exists')
    return
  }

  const hashedPassword = await bcrypt.hash('Admin12345', 10)

  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin@dentcare.ua',
      password: hashedPassword,
      role: 'SUPERADMIN',
    },
  })

  console.log('Admin created:')
  console.log(admin)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })