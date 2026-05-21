const express = require('express')

const router = express.Router()

const serviceController = require('../controllers/serviceController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', serviceController.getAll)
router.get('/category/:categorySlug', serviceController.getByCategory)
router.get('/:slug', serviceController.getBySlug)

router.get(
  '/admin/list',
  authMiddleware,
  serviceController.getAdminList
)

router.post(
  '/admin/create',
  authMiddleware,
  serviceController.create
)

router.put(
  '/admin/update/:id',
  authMiddleware,
  serviceController.update
)

router.patch(
  '/admin/status/:id',
  authMiddleware,
  serviceController.toggleStatus
)

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  serviceController.remove
)

module.exports = router