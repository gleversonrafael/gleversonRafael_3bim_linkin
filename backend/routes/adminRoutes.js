const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// CRUD de Administradores

router.get('/abrirCrudAdmin', adminController.abrirCrudAdmin);
router.get('/', adminController.listarAdmins);
router.post('/', adminController.criarAdmin);
router.get('/:username', adminController.obterAdmin);
router.put('/:username', adminController.atualizarAdmin);
router.delete('/:username', adminController.deletarAdmin);

module.exports = router;