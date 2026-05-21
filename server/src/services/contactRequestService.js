const prisma = require('../config/prisma')

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '')
}

exports.create = async (data) => {
  const {
    name,
    phone,
    email,
    subject,
    message,
  } = data

  if (!name || !phone || !message) {
    throw new Error('Name, phone and message are required')
  }

  return prisma.contactRequest.create({
    data: {
      name,
      phone: normalizePhone(phone),
      email: email || null,
      subject: subject || null,
      message,
    },
  })
}

exports.getAdminList = async () => {
  return prisma.contactRequest.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

exports.updateStatus = async (id, status) => {
  const allowedStatuses = [
    'NEW',
    'PROCESSED',
  ]

  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  const existingRequest =
    await prisma.contactRequest.findUnique({
      where: {
        id,
      },
    })

  if (!existingRequest) {
    throw new Error('Request not found')
  }

  return prisma.contactRequest.update({
    where: {
      id,
    },
    data: {
      status,
    },
  })
}

exports.remove = async (id) => {
  const existingRequest =
    await prisma.contactRequest.findUnique({
      where: {
        id,
      },
    })

  if (!existingRequest) {
    throw new Error('Request not found')
  }

  await prisma.contactRequest.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Request deleted successfully',
  }
}