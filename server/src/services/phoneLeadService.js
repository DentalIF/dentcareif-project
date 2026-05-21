const prisma = require('../config/prisma')

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '')
}

exports.create = async (data) => {
  const {
    phone,
    source,
  } = data

  if (!phone) {
    throw new Error('Phone is required')
  }

  const normalizedPhone = normalizePhone(phone)

  return prisma.phoneLead.create({
    data: {
      phone: normalizedPhone,
      source: source || 'website',
    },
  })
}

exports.getAdminList = async () => {
  return prisma.phoneLead.findMany({
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

  const existingLead =
    await prisma.phoneLead.findUnique({
      where: {
        id,
      },
    })

  if (!existingLead) {
    throw new Error('Lead not found')
  }

  return prisma.phoneLead.update({
    where: {
      id,
    },
    data: {
      status,
    },
  })
}

exports.remove = async (id) => {
  const existingLead =
    await prisma.phoneLead.findUnique({
      where: {
        id,
      },
    })

  if (!existingLead) {
    throw new Error('Lead not found')
  }

  await prisma.phoneLead.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Lead deleted successfully',
  }
}