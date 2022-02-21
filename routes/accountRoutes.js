const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

router
  .route('/')
  .get(accountController.getAllAccounts)
  .post(accountController.createNewAccount);

router
  .route('/:id')
  .get(accountController.getOneAccount)
  .put(accountController.updateOneAccount)
  .delete(accountController.deleteOneAccount);

module.exports = router;
