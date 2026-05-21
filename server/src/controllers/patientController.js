const patientService = require('../services/patientService')

exports.getAdminList = async (req, res) => {
  try {
    const data = await patientService.getAdminList(req.query)

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

exports.getById = async (req, res) => {
  try {
    const data = await patientService.getById(req.params.id)

    res.json(data)
  } catch (error) {
    res.status(404).json({
      message: error.message,
    })
  }
}

exports.update = async (req, res) => {
  try {
    const data = await patientService.update(
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
    const data = await patientService.remove(req.params.id)

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}