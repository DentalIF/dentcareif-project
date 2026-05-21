const prisma = require('../config/prisma')

exports.getAll = async () => {
  return prisma.doctor.findMany({
    where: {
      isActive: true,
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })
}

exports.getBySlug = async (slug) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      slug,
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
      schedules: {
        orderBy: {
          dayOfWeek: 'asc',
        },
      },
    },
  })

  if (!doctor || !doctor.isActive) {
    throw new Error('Doctor not found')
  }

  return doctor
}

exports.getByService = async (serviceId) => {
  return prisma.doctor.findMany({
    where: {
      isActive: true,
      services: {
        some: {
          serviceId,
        },
      },
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })
}

exports.getByServiceSlug = async (serviceSlug) => {
  return prisma.doctor.findMany({
    where: {
      isActive: true,

      services: {
        some: {
          service: {
            slug: serviceSlug,
          },
        },
      },
    },

    include: {
      services: {
        include: {
          service: true,
        },
      },
    },

    orderBy: {
      sortOrder: 'asc',
    },
  })
}

exports.getAdminList = async () => {
  return prisma.doctor.findMany({
    include: {
      services: {
        include: {
          service: true,
        },
      },
      schedules: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })
}

exports.create = async (data) => {
  const {
    firstName,
    lastName,
    slug,
    position,
    experience,
    education,
    description,
    image,
    sortOrder,
    serviceIds,
    certificates,
  } = data

  if (!firstName || !lastName || !slug || !position) {
    throw new Error('First name, last name, slug and position are required')
  }

  const existingDoctor = await prisma.doctor.findUnique({
    where: {
      slug,
    },
  })

  if (existingDoctor) {
    throw new Error('Doctor with this slug already exists')
  }

  return prisma.doctor.create({
    data: {
      firstName,
      lastName,
      slug,
      position,
      experience: experience ? Number(experience) : null,
      education: education || null,
      description: description || null,
      image: image || null,
      sortOrder: Number(sortOrder) || 0,
      certificates: certificates || null,

      services: Array.isArray(serviceIds)
        ? {
            create: serviceIds.map((serviceId) => ({
              service: {
                connect: {
                  id: serviceId,
                },
              },
            })),
          }
        : undefined,
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  })
}

exports.update = async (id, data) => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
  })

  if (!existingDoctor) {
    throw new Error('Doctor not found')
  }

  if (data.slug && data.slug !== existingDoctor.slug) {
    const doctorWithSlug = await prisma.doctor.findUnique({
      where: {
        slug: data.slug,
      },
    })

    if (doctorWithSlug) {
      throw new Error('Doctor with this slug already exists')
    }
  }

  if (Array.isArray(data.serviceIds)) {
    await prisma.doctorService.deleteMany({
      where: {
        doctorId: id,
      },
    })

    await prisma.doctorService.createMany({
      data: data.serviceIds.map((serviceId) => ({
        doctorId: id,
        serviceId,
      })),
      skipDuplicates: true,
    })
  }

  return prisma.doctor.update({
    where: {
      id,
    },
    data: {
      firstName: data.firstName ?? existingDoctor.firstName,
      lastName: data.lastName ?? existingDoctor.lastName,
      slug: data.slug ?? existingDoctor.slug,
      position: data.position ?? existingDoctor.position,

      experience:
        data.experience !== undefined && data.experience !== null
          ? Number(data.experience)
          : existingDoctor.experience,

      education: data.education ?? existingDoctor.education,
      certificates: data.certificates ?? existingDoctor.certificates,
      description: data.description ?? existingDoctor.description,
      image: data.image ?? existingDoctor.image,

      sortOrder:
        data.sortOrder !== undefined
          ? Number(data.sortOrder)
          : existingDoctor.sortOrder,
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  })
}


exports.toggleStatus = async (id) => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
  })

  if (!existingDoctor) {
    throw new Error('Doctor not found')
  }

  return prisma.doctor.update({
    where: {
      id,
    },
    data: {
      isActive: !existingDoctor.isActive,
    },
  })
}

exports.remove = async (id) => {
  const existingDoctor = await prisma.doctor.findUnique({
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

  if (!existingDoctor) {
    throw new Error('Doctor not found')
  }

  if (existingDoctor._count.appointments > 0) {
    throw new Error('Cannot delete doctor with appointments')
  }

  await prisma.doctor.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Doctor deleted successfully',
  }
}