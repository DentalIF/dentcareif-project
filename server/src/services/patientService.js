const prisma = require('../config/prisma')

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '')
}

exports.getAdminList = async ({ search } = {}) => {
  const where = {}

  if (search) {
    where.OR = [
      {
        firstName: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        lastName: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        phone: {
          contains: search,
        },
      },
      {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ]
  }

  return prisma.patient.findMany({
    where,
    include: {
      _count: {
        select: {
          appointments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

exports.getById = async (id) => {
  const patient = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      appointments: {
        include: {
          doctor: true,
          service: true,
        },
        orderBy: [
          {
            appointmentDate: 'desc',
          },
          {
            startTime: 'asc',
          },
        ],
      },
    },
  })

  if (!patient) {
    throw new Error('Patient not found')
  }

  return patient
}

exports.update = async (id, data) => {
  const existingPatient = await prisma.patient.findUnique({
    where: {
      id,
    },
  })

  if (!existingPatient) {
    throw new Error('Patient not found')
  }

  let phone = existingPatient.phone

  if (data.phone !== undefined) {
    phone = normalizePhone(data.phone)

    if (!phone) {
      throw new Error('Phone is required')
    }

    if (phone !== existingPatient.phone) {
      const patientWithPhone = await prisma.patient.findUnique({
        where: {
          phone,
        },
      })

      if (patientWithPhone) {
        throw new Error('Patient with this phone already exists')
      }
    }
  }

  return prisma.patient.update({
    where: {
      id,
    },
    data: {
      firstName: data.firstName ?? existingPatient.firstName,
      lastName: data.lastName ?? existingPatient.lastName,
      phone,
      email: data.email ?? existingPatient.email,
      birthDate:
        data.birthDate !== undefined && data.birthDate
          ? new Date(data.birthDate)
          : existingPatient.birthDate,
      comment: data.comment ?? existingPatient.comment,
    },
  })
}

exports.remove = async (id) => {
  const existingPatient = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  })

  if (!existingPatient) {
    throw new Error('Patient not found')
  }

  if (existingPatient._count.appointments > 0) {
    throw new Error('Cannot delete patient with appointments')
  }

  await prisma.patient.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Patient deleted successfully',
  }
}