const serviceService = require('../services/serviceService')

exports.getAll = async (req, res) => {
  try {
    const data = await serviceService.getAll()

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

exports.getBySlug = async (req, res) => {
  try {
    const data = await serviceService.getBySlug(
      req.params.slug
    )

    res.json(data)
  } catch (error) {
    res.status(404).json({
      message: error.message,
    })
  }
}

exports.getByCategory = async (req, res) => {
  try {
    const data = await serviceService.getByCategory(
      req.params.categorySlug
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
    const data = await serviceService.getAdminList()

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

exports.create = async (req, res) => {
  try {
    const data = await serviceService.create(req.body)

    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.update = async (req, res) => {
  try {
    const data = await serviceService.update(
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
    const data = await serviceService.toggleStatus(
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
    const data = await serviceService.remove(
      req.params.id
    )

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}