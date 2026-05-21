const contactRequestService = require('../services/contactRequestService')

exports.create = async (req, res) => {
  try {
    const data = await contactRequestService.create(req.body)

    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.getAdminList = async (req, res) => {
  try {
    const data = await contactRequestService.getAdminList()

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const data = await contactRequestService.updateStatus(
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

exports.remove = async (req, res) => {
  try {
    const data = await contactRequestService.remove(req.params.id)

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}