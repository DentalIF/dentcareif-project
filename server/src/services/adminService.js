const prisma = require('../config/prisma')

function getTodayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  return {
    start,
    end,
  }
}

exports.getDashboard = async () => {
  const { start, end } = getTodayRange()

  const [
    newAppointmentsCount,
    todayAppointmentsCount,
    patientsCount,
    contactRequestsCount,
    phoneLeadsCount,
    activeServicesCount,
    activeDoctorsCount,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        status: 'NEW',
      },
    }),

    prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: start,
          lte: end,
        },
      },
    }),

    prisma.patient.count(),

    prisma.contactRequest.count({
      where: {
        status: 'NEW',
      },
    }),

    prisma.phoneLead.count({
      where: {
        status: 'NEW',
      },
    }),

    prisma.service.count({
      where: {
        isActive: true,
      },
    }),

    prisma.doctor.count({
      where: {
        isActive: true,
      },
    }),
  ])

  return {
    newAppointmentsCount,
    todayAppointmentsCount,
    patientsCount,
    contactRequestsCount,
    phoneLeadsCount,
    activeServicesCount,
    activeDoctorsCount,
  }
}