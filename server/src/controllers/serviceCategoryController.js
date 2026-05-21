const serviceCategoryService = require('../services/serviceCategoryService')

exports.getAll = async (req, res) => {
  try {
    const data = await serviceCategoryService.getAll()

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

exports.getBySlug = async (req, res) => {
  try {
    const data = await serviceCategoryService.getBySlug(
      req.params.slug
    )

    res.json(data)
  } catch (error) {
    res.status(404).json({
      message: error.message,
    })
  }
}

exports.getAdminList = async (req, res) => {
  try {
    const data = await serviceCategoryService.getAdminList()

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

exports.create = async (req, res) => {
  try {
    const data = await serviceCategoryService.create(req.body)

    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.update = async (req, res) => {
  try {
    const data = await serviceCategoryService.update(
      req.params.id,
      req.body
    )

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.toggleStatus = async (req, res) => {
  try {
    const data = await serviceCategoryService.toggleStatus(
      req.params.id
    )

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.remove = async (req, res) => {
  try {
    const data = await serviceCategoryService.remove(
      req.params.id
    )

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}