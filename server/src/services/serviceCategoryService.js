const prisma = require('../config/prisma')

exports.getAll = async () => {
  return prisma.serviceCategory.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })
}

exports.getBySlug = async (slug) => {
  const category = await prisma.serviceCategory.findUnique({
    where: {
      slug,
    },
    include: {
      services: {
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  })

  if (!category || !category.isActive) {
    throw new Error('Category not found')
  }

  return category
}

exports.getAdminList = async () => {
  return prisma.serviceCategory.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
    include: {
      _count: {
        select: {
          services: true,
        },
      },
    },
  })
}

exports.create = async (data) => {
  const { title, slug, description, image, sortOrder } = data

  if (!title || !slug) {
    throw new Error('Title and slug are required')
  }

  const existingCategory = await prisma.serviceCategory.findUnique({
    where: {
      slug,
    },
  })

  if (existingCategory) {
    throw new Error('Category with this slug already exists')
  }

  return prisma.serviceCategory.create({
    data: {
      title,
      slug,
      description: description || null,
      image: image || null,
      sortOrder: Number(sortOrder) || 0,
    },
  })
}

exports.update = async (id, data) => {
  const { title, slug, description, image, sortOrder } = data

  const existingCategory = await prisma.serviceCategory.findUnique({
    where: {
      id,
    },
  })

  if (!existingCategory) {
    throw new Error('Category not found')
  }

  if (slug && slug !== existingCategory.slug) {
    const categoryWithSlug = await prisma.serviceCategory.findUnique({
      where: {
        slug,
      },
    })

    if (categoryWithSlug) {
      throw new Error('Category with this slug already exists')
    }
  }

  return prisma.serviceCategory.update({
    where: {
      id,
    },
    data: {
      title: title ?? existingCategory.title,
      slug: slug ?? existingCategory.slug,
      description: description ?? existingCategory.description,
      image: image ?? existingCategory.image,
      sortOrder:
        sortOrder !== undefined
          ? Number(sortOrder)
          : existingCategory.sortOrder,
    },
  })
}

exports.toggleStatus = async (id) => {
  const existingCategory = await prisma.serviceCategory.findUnique({
    where: {
      id,
    },
  })

  if (!existingCategory) {
    throw new Error('Category not found')
  }

  return prisma.serviceCategory.update({
    where: {
      id,
    },
    data: {
      isActive: !existingCategory.isActive,
    },
  })
}

exports.remove = async (id) => {
  const existingCategory = await prisma.serviceCategory.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          services: true,
        },
      },
    },
  })

  if (!existingCategory) {
    throw new Error('Category not found')
  }

  if (existingCategory._count.services > 0) {
    throw new Error('Cannot delete category with services')
  }

  await prisma.serviceCategory.delete({
    where: {
      id,
    },
  })

  return {
    message: 'Category deleted successfully',
  }
}