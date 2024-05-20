const express = require('express')
const userController = require('../controllers/v1/userController')

const router = express.Router()

router.post('/', (req, res, next) => userController.createUser(req, res, next))
router.get('/:id', (req, res, next) =>
  userController.getUserById(req, res, next)
)
router.get('/', (req, res, next) => userController.getAllUsers(req, res, next))

module.exports = router
