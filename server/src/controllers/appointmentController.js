const appointmentService = require('../services/appointmentService')

exports.getAvailableSlots = async (req, res) => {
  try {
    const data = await appointmentService.getAvailableSlots(req.query)

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.createOnline = async (req, res) => {
  try {
    const data = await appointmentService.create({
      ...req.body,
      source: 'ONLINE',
    })

    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.createByAdmin = async (req, res) => {
  try {
    const data = await appointmentService.create({
      ...req.body,
      source: 'ADMIN',
    })

    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.getAdminList = async (req, res) => {
  try {
    const data = await appointmentService.getAdminList(req.query)

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const data = await appointmentService.updateStatus(
      req.params.id,
      req.body.status
    )

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.update = async (req, res) => {
  try {
    const data = await appointmentService.update(
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

exports.remove = async (req, res) => {
  try {
    const data = await appointmentService.remove(req.params.id)

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}