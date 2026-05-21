const prisma = require('../config/prisma')

function parseTextLines(value) {
  if (!value) return []

  return String(value)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parsePairLines(value, firstKey, secondKey) {
  if (!value) return []

  return String(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [firstPart, ...restParts] = line.split('|')

      return {
        [firstKey]: firstPart.trim(),
        [secondKey]: restParts.join('|').trim(),
      }
    })
    .filter((item) => item[firstKey] && item[secondKey])
}

exports.getAll = async () => {
  return prisma.service.findMany({
    where: {
      isActive: true,
      category: {
        isActive: true,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })
}

exports.getBySlug = async (slug) => {
  const service = await prisma.service.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      doctorLinks: {
        include: {
          doctor: true,
        },
      },
      indications: {
        orderBy: {
          sortOrder: 'asc',
        },
      },

      steps: {
        orderBy: {
          sortOrder: 'asc',
        },
      },

      included: {
        orderBy: {
          sortOrder: 'asc',
        },
      },

      faqs: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  })

  if (!service || !service.isActive) {
    throw new Error('Service not found')
  }

  return service
}

exports.getByCategory = async (categorySlug) => {
  const category = await prisma.serviceCategory.findUnique({
    where: {
      slug: categorySlug,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  return prisma.service.findMany({
    where: {
      categoryId: category.id,
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })
}

exports.getAdminList = async () => {
  return prisma.service.findMany({
    include: {
      category: true,
      _count: {
        select: {
          appointments: true,
        },
      },
      indications: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
      included: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
      steps: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
      faqs: {
        orderBy: {
          sortOrder: 'asc',
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
    categoryId,
    title,
    slug,
    shortDesc,
    fullDesc,
    price,
    duration,
    image,
    badge,
    sortOrder,
    indications,
    steps,
    included,
    faqs,
  } = data

  if (!categoryId) {
    throw new Error('Category is required')
  }

  if (!title || !slug) {
    throw new Error('Title and slug are required')
  }

  if (!duration) {
    throw new Error('Duration is required')
  }

  const category = await prisma.serviceCategory.findUnique({
    where: {
      id: categoryId,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  const existingService = await prisma.service.findUnique({
    where: {
      slug,
    },
  })

  if (existingService) {
    throw new Error('Service with this slug already exists')
  }

  const parsedIndications = parseTextLines(data.indications ?? indications)
  const parsedIncluded = parseTextLines(data.included ?? included)
  const parsedSteps = parsePairLines(data.steps ?? steps, 'title', 'text')
  const parsedFaqs = parsePairLines(data.faqs ?? faqs, 'question', 'answer')

return prisma.service.create({
  data: {
    categoryId,
    title,
    slug,
    shortDesc: shortDesc || null,
    fullDesc: fullDesc || null,
    price: price ? Number(price) : null,
    duration: Number(duration),
    image: image || null,
    badge: badge || null,
    sortOrder: Number(sortOrder) || 0,

    indications: {
      create: parsedIndications.map((item, index) => ({
        text: item,
        sortOrder: index,
      })),
    },

    included: {
      create: parsedIncluded.map((item, index) => ({
        text: item,
        sortOrder: index,
      })),
    },

    steps: {
      create: parsedSteps.map((item, index) => ({
        title: item.title,
        text: item.text,
        sortOrder: index,
      })),
    },

    faqs: {
      create: parsedFaqs.map((item, index) => ({
        question: item.question,
        answer: item.answer,
        sortOrder: index,
      })),
    },
  },

  include: {
    category: true,
    indications: true,
    included: true,
    steps: true,
    faqs: true,
  },
})

}

exports.update = async (id, data) => {
  const existingService = await prisma.service.findUnique({
    where: {
      id,
    },
  })

  if (!existingService) {
    throw new Error('Service not found')
  }

  if (data.slug && data.slug !== existingService.slug) {
    const serviceWithSlug = await prisma.service.findUnique({
      where: {
        slug: data.slug,
      },
    })

    if (serviceWithSlug) {
      throw new Error('Service with this slug already exists')
    }
  }

  const parsedIndications = parseTextLines(data.indications ?? indications)
  const parsedIncluded = parseTextLines(data.included ?? included)
  const parsedSteps = parsePairLines(data.steps ?? steps, 'title', 'text')
  const parsedFaqs = parsePairLines(data.faqs ?? faqs, 'question', 'answer')

return prisma.service.update({
  where: {
    id,
  },
  data: {
    categoryId: data.categoryId ?? existingService.categoryId,
    title: data.title ?? existingService.title,
    slug: data.slug ?? existingService.slug,
    shortDesc: data.shortDesc ?? existingService.shortDesc,
    fullDesc: data.fullDesc ?? existingService.fullDesc,

    price:
      data.price !== undefined
        ? Number(data.price)
        : existingService.price,

    duration:
      data.duration !== undefined
        ? Number(data.duration)
        : existingService.duration,

    image: data.image ?? existingService.image,
    badge: data.badge ?? existingService.badge,

    sortOrder:
      data.sortOrder !== undefined
        ? Number(data.sortOrder)
        : existingService.sortOrder,

    indications: {
      deleteMany: {},
      create: parsedIndications.map((item, index) => ({
        text: item,
        sortOrder: index,
      })),
    },

    included: {
      deleteMany: {},
      create: parsedIncluded.map((item, index) => ({
        text: item,
        sortOrder: index,
      })),
    },

    steps: {
      deleteMany: {},
      create: parsedSteps.map((item, index) => ({
        title: item.title,
        text: item.text,
        sortOrder: index,
      })),
    },

    faqs: {
      deleteMany: {},
      create: parsedFaqs.map((item, index) => ({
        question: item.question,
        answer: item.answer,
        sortOrder: index,
      })),
    },
  },
  include: {
    category: true,
    indications: true,
    included: true,
    steps: true,
    faqs: true,
  },
})

}

exports.toggleStatus = async (id) => {
  const existingService = await prisma.service.findUnique({
    where: {
      id,
    },
  })

  if (!existingService) {
    throw new Error('Service not found')
  }

  return prisma.service.update({
    where: {
      id,
    },
    data: {
      isActive: !existingService.isActive,
    },
  })
}

exports.remove = async (id) => {
  const existingService = await prisma.service.findUnique({
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

  if (!existingService) {
    throw new Error('Service not found')
  }

  if (existingService._count.appointments > 0) {
    throw new Error(
      'Cannot delete service with appointments'
    )
  }

  await prisma.service.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Service deleted successfully',
  }
}