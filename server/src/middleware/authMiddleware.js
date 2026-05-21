const jwt = require('jsonwebtoken')

const prisma = require('../config/prisma')

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const user = await prisma.adminUser.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
      })
    }

    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized',
    })
  }
}