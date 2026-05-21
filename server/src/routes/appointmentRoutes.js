const express = require('express')

const router = express.Router()

const appointmentController = require('../controllers/appointmentController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/available-slots', appointmentController.getAvailableSlots)

router.post('/', appointmentController.createOnline)

router.get(
  '/admin/list',
  authMiddleware,
  appointmentController.getAdminList
)

router.post(
  '/admin/create',
  authMiddleware,
  appointmentController.createByAdmin
)

router.patch(
  '/admin/status/:id',
  authMiddleware,
  appointmentController.updateStatus
)

router.put(
  '/admin/update/:id',
  authMiddleware,
  appointmentController.update
)

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  appointmentController.remove
)

module.exports = router