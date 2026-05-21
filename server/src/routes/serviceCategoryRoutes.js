const express = require('express')

const router = express.Router()

const serviceCategoryController = require('../controllers/serviceCategoryController')

const authMiddleware = require('../middleware/authMiddleware')

router.get('/', serviceCategoryController.getAll)
router.get('/:slug', serviceCategoryController.getBySlug)

router.get(
  '/admin/list',
  authMiddleware,
  serviceCategoryController.getAdminList
)

router.post(
  '/admin/create',
  authMiddleware,
  serviceCategoryController.create
)

router.put(
  '/admin/update/:id',
  authMiddleware,
  serviceCategoryController.update
)

router.patch(
  '/admin/status/:id',
  authMiddleware,
  serviceCategoryController.toggleStatus
)

router.delete(
  '/admin/delete/:id',
  authMiddleware,
  serviceCategoryController.remove
)

module.exports = router