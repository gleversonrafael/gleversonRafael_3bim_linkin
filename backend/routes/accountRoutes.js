const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// CRUD de Contas (Account)
router.get('/abrirCrudAccount', accountController.abrirCrudAccount);
router.get('/', accountController.listarAccounts);
router.post('/', accountController.criarAccount);
router.get('/:username', accountController.obterAccount);
router.put('/:username', accountController.atualizarAccount);
router.delete('/:username', accountController.deletarAccount);

module.exports = router;