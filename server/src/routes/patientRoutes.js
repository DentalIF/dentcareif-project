const express = require('express')

const router = express.Router()

const patientController = require('../controllers/patientController')
const authMiddleware = require('../middleware/authMiddleware')

router.get(
  '/admin/list',
  authMiddleware,
  patientController.getAdminList
)

router.get(
  '/admin/:id',
  authMiddleware,
  patientController.getById
)

router.put(
  '/admin/update/:id',
  authMiddleware,
  patientController.update
)

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  patientController.remove
)

module.exports = router