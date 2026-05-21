const express = require('express')

const router = express.Router()

const doctorScheduleController = require('../controllers/doctorScheduleController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:doctorId', doctorScheduleController.getByDoctor)

router.post(
  '/admin/create',
  authMiddleware,
  doctorScheduleController.create
)

router.put(
  '/admin/update/:id',
  authMiddleware,
  doctorScheduleController.update
)

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  doctorScheduleController.remove
)

module.exports = router