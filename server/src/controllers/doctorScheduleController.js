const doctorScheduleService = require('../services/doctorScheduleService')

exports.getByDoctor = async (req, res) => {
  try {
    const data = await doctorScheduleService.getByDoctor(req.params.doctorId)

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

exports.create = async (req, res) => {
  try {
    const data = await doctorScheduleService.create(req.body)

    res.status(201).json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.update = async (req, res) => {
  try {
    const data = await doctorScheduleService.update(req.params.id, req.body)

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}

exports.remove = async (req, res) => {
  try {
    const data = await doctorScheduleService.remove(req.params.id)

    res.json(data)
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
}