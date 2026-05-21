const adminService = require('../services/adminService')

exports.getDashboard = async (req, res) => {
  try {
    const data = await adminService.getDashboard()

    res.json(data)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}