const prisma = require('../config/prisma')

const {
  timeToMinutes,
  minutesToTime,
  generateAvailableSlots,
} = require('../utils/timeSlots')

function normalizeDate(date) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date')
  }

  parsedDate.setHours(0, 0, 0, 0)

  return parsedDate
}

function getDayOfWeek(date) {
  const day = date.getDay()

  return day === 0 ? 7 : day
}

function normalizePhone(phone) {
  return String(phone || '').replace(/[^\d+]/g, '')
}

async function validateDoctorService(doctorId, serviceId) {
  const doctorService = await prisma.doctorService.findFirst({
    where: {
      doctorId,
      serviceId,
    },
  })

  if (!doctorService) {
    throw new Error('Selected doctor does not provide this service')
  }
}

async function ensureSlotIsAvailable({
  doctorId,
  serviceId,
  appointmentDate,
  startTime,
  excludeAppointmentId,
}) {
  const slots = await exports.getAvailableSlots({
    doctorId,
    serviceId,
    date: appointmentDate.toISOString(),
    excludeAppointmentId,
  })

  const selectedSlot = slots.find((slot) => {
    return slot.startTime === startTime
  })

  if (!selectedSlot) {
    throw new Error('Selected time slot is not available')
  }

  return selectedSlot
}

exports.getAvailableSlots = async ({
  doctorId,
  serviceId,
  date,
  excludeAppointmentId,
}) => {
  if (!doctorId || !serviceId || !date) {
    throw new Error('Doctor, service and date are required')
  }

  await validateDoctorService(doctorId, serviceId)

  const appointmentDate = normalizeDate(date)
  const dayOfWeek = getDayOfWeek(appointmentDate)

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  })

  if (!service || !service.isActive) {
    throw new Error('Service not found')
  }

  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
  })

  if (!doctor || !doctor.isActive) {
    throw new Error('Doctor not found')
  }

  const schedule = await prisma.doctorSchedule.findFirst({
    where: {
      doctorId,
      dayOfWeek,
      isActive: true,
    },
  })

  if (!schedule) {
    return []
  }

  const busyAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate,
      status: {
        not: 'CANCELED',
      },
      ...(excludeAppointmentId
        ? {
            id: {
              not: excludeAppointmentId,
            },
          }
        : {}),
    },
    select: {
      startTime: true,
      endTime: true,
    },
  })

  return generateAvailableSlots({
    scheduleStart: schedule.startTime,
    scheduleEnd: schedule.endTime,
    serviceDuration: service.duration,
    busyAppointments,
  })
}

exports.create = async (data) => {
  const {
    patientFirstName,
    patientLastName,
    patientPhone,
    patientEmail,
    doctorId,
    serviceId,
    appointmentDate,
    startTime,
    comment,
    source,
  } = data

  if (
    !patientFirstName ||
    !patientPhone ||
    !doctorId ||
    !serviceId ||
    !appointmentDate ||
    !startTime
  ) {
    throw new Error('Required fields are missing')
  }

  await validateDoctorService(doctorId, serviceId)

  const normalizedDate = normalizeDate(appointmentDate)
  const phone = normalizePhone(patientPhone)

  if (!phone) {
    throw new Error('Phone is required')
  }

  const selectedSlot = await ensureSlotIsAvailable({
    doctorId,
    serviceId,
    appointmentDate: normalizedDate,
    startTime,
  })

  const patient = await prisma.patient.upsert({
    where: {
      phone,
    },
    update: {
      firstName: patientFirstName,
      lastName: patientLastName || null,
      email: patientEmail || null,
    },
    create: {
      firstName: patientFirstName,
      lastName: patientLastName || null,
      phone,
      email: patientEmail || null,
    },
  })

  return prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId,
      serviceId,
      appointmentDate: normalizedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      source: source || 'ONLINE',
      comment: comment || null,
      status: 'NEW',
    },
    include: {
      patient: true,
      doctor: true,
      service: true,
    },
  })
}

exports.getAdminList = async ({
  status,
  doctorId,
  serviceId,
  date,
}) => {
  const where = {}

  if (status) {
    where.status = status
  }

  if (doctorId) {
    where.doctorId = doctorId
  }

  if (serviceId) {
    where.serviceId = serviceId
  }

  if (date) {
    where.appointmentDate = normalizeDate(date)
  }

  return prisma.appointment.findMany({
    where,
    include: {
      patient: true,
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
  })
}

exports.updateStatus = async (id, status) => {
  const allowedStatuses = [
    'NEW',
    'CONFIRMED',
    'DONE',
    'CANCELED',
  ]

  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  const existingAppointment = await prisma.appointment.findUnique({
    where: {
      id,
    },
  })

  if (!existingAppointment) {
    throw new Error('Appointment not found')
  }

  return prisma.appointment.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: {
      patient: true,
      doctor: true,
      service: true,
    },
  })
}

exports.update = async (id, data) => {
  const existingAppointment = await prisma.appointment.findUnique({
    where: {
      id,
    },
    include: {
      patient: true,
    },
  })

  if (!existingAppointment) {
    throw new Error('Appointment not found')
  }

  const doctorId = data.doctorId ?? existingAppointment.doctorId
  const serviceId = data.serviceId ?? existingAppointment.serviceId
  const appointmentDate = data.appointmentDate
    ? normalizeDate(data.appointmentDate)
    : existingAppointment.appointmentDate
  const startTime = data.startTime ?? existingAppointment.startTime

  await validateDoctorService(doctorId, serviceId)

  const selectedSlot = await ensureSlotIsAvailable({
    doctorId,
    serviceId,
    appointmentDate,
    startTime,
    excludeAppointmentId: id,
  })

  if (
    data.patientFirstName ||
    data.patientLastName ||
    data.patientEmail ||
    data.patientPhone
  ) {
    const phone = data.patientPhone
      ? normalizePhone(data.patientPhone)
      : existingAppointment.patient.phone

    await prisma.patient.update({
      where: {
        id: existingAppointment.patientId,
      },
      data: {
        firstName:
          data.patientFirstName ??
          existingAppointment.patient.firstName,
        lastName:
          data.patientLastName ??
          existingAppointment.patient.lastName,
        phone,
        email:
          data.patientEmail ??
          existingAppointment.patient.email,
      },
    })
  }

  return prisma.appointment.update({
    where: {
      id,
    },
    data: {
      doctorId,
      serviceId,
      appointmentDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      comment: data.comment ?? existingAppointment.comment,
      status: data.status ?? existingAppointment.status,
    },
    include: {
      patient: true,
      doctor: true,
      service: true,
    },
  })
}

exports.remove = async (id) => {
  const existingAppointment = await prisma.appointment.findUnique({
    where: {
      id,
    },
  })

  if (!existingAppointment) {
    throw new Error('Appointment not found')
  }

  await prisma.appointment.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Appointment deleted successfully',
  }
}