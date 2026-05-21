const express = require('express')

const router = express.Router()

const phoneLeadController = require('../controllers/phoneLeadController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', phoneLeadController.create)

router.get(
  '/admin/list',
  authMiddleware,
  phoneLeadController.getAdminList
)

router.patch(
  '/admin/status/:id',
  authMiddleware,
  phoneLeadController.updateStatus
)

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  phoneLeadController.remove
)

module.exports = router