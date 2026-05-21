const express = require('express')

const router = express.Router()

const contactRequestController = require('../controllers/contactRequestController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', contactRequestController.create)

router.get(
  '/admin/list',
  authMiddleware,
  contactRequestController.getAdminList
)

router.patch(
  '/admin/status/:id',
  authMiddleware,
  contactRequestController.updateStatus
)

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  contactRequestController.remove
)

module.exports = router