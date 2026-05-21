const authService = require('../services/authService')

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body)

    res.json(result)
  } catch (error) {
    res.status(401).json({
      message: error.message,
    })
  }
}

exports.me = async (req, res) => {
  try {
    const result = await authService.me(req)

    res.json(result)
  } catch (error) {
    res.status(401).json({
      message: error.message,
    })
  }
}