const prisma = require('../config/prisma')

exports.getByDoctor = async (doctorId) => {
  return prisma.doctorSchedule.findMany({
    where: {
      doctorId,
    },
    orderBy: {
      dayOfWeek: 'asc',
    },
  })
}

exports.create = async (data) => {
  const {
    doctorId,
    dayOfWeek,
    startTime,
    endTime,
  } = data

  if (
    !doctorId ||
    !dayOfWeek ||
    !startTime ||
    !endTime
  ) {
    throw new Error('All fields are required')
  }

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  })

  if (!doctor) {
    throw new Error('Doctor not found')
  }

  const existingSchedule =
    await prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        dayOfWeek: Number(dayOfWeek),
      },
    })

  if (existingSchedule) {
    throw new Error(
      'Schedule for this day already exists'
    )
  }

  return prisma.doctorSchedule.create({
    data: {
      doctorId,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
    },
  })
}

exports.update = async (id, data) => {
  const existingSchedule =
    await prisma.doctorSchedule.findUnique({
      where: {
        id,
      },
    })

  if (!existingSchedule) {
    throw new Error('Schedule not found')
  }

  return prisma.doctorSchedule.update({
    where: {
      id,
    },
    data: {
      dayOfWeek:
        data.dayOfWeek !== undefined
          ? Number(data.dayOfWeek)
          : existingSchedule.dayOfWeek,

      startTime:
        data.startTime ?? existingSchedule.startTime,

      endTime:
        data.endTime ?? existingSchedule.endTime,

      isActive:
        data.isActive !== undefined
          ? Boolean(data.isActive)
          : existingSchedule.isActive,
    },
  })
}

exports.remove = async (id) => {
  const existingSchedule =
    await prisma.doctorSchedule.findUnique({
      where: {
        id,
      },
    })

  if (!existingSchedule) {
    throw new Error('Schedule not found')
  }

  await prisma.doctorSchedule.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Schedule deleted successfully',
  }
}