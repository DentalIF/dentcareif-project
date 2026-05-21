const doctorService = require('../services/doctorService')

exports.getAll = async (req, res) => {
  try {
    const { service } = req.query

    const data = service
      ? await doctorService.getByServiceSlug(service)
      : await doctorService.getAll()

    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getBySlug = async (req, res) => {
  try {
    const data = await doctorService.getBySlug(req.params.slug)
    res.json(data)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

exports.getByService = async (req, res) => {
  try {
    const data = await doctorService.getByService(req.params.serviceId)
    res.json(data)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

exports.getAdminList = async (req, res) => {
  try {
    const data = await doctorService.getAdminList()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.create = async (req, res) => {
  try {
    const data = await doctorService.create(req.body)
    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.update = async (req, res) => {
  try {
    const data = await doctorService.update(req.params.id, req.body)
    res.json(data)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.toggleStatus = async (req, res) => {
  try {
    const data = await doctorService.toggleStatus(req.params.id)
    res.json(data)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.remove = async (req, res) => {
  try {
    const data = await doctorService.remove(req.params.id)
    res.json(data)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}