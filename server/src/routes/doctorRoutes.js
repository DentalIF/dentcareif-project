const express = require('express')

const router = express.Router()

const doctorController = require('../controllers/doctorController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', doctorController.getAll)

router.get(
  '/service/:serviceId',
  doctorController.getByService
)

router.get('/:slug', doctorController.getBySlug)

router.get(
  '/admin/list',
  authMiddleware,
  doctorController.getAdminList
)

router.post(
  '/admin/create',
  authMiddleware,
  doctorController.create
)

router.put(
  '/admin/update/:id',
  authMiddleware,
  doctorController.update
)

router.patch(
  '/admin/status/:id',
  authMiddleware,
  doctorController.toggleStatus
)

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  doctorController.remove
)

module.exports = router