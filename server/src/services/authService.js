const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const prisma = require('../config/prisma')

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  })

  if (!admin) {
    throw new Error('Invalid credentials')
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    admin.password
  )

  if (!isPasswordValid) {
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign(
    {
      id: admin.id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  )

  return {
    token,
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  }
}

exports.me = async (req) => {
  return req.user
}