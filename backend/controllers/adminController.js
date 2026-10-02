const { query } = require('../database');
const path = require('path');

exports.abrirCrudAdmin = (req, res) => {
    const usuario = req.cookies ? req.cookies.usuarioLogado : null;
    if (usuario) {
        res.sendFile(path.join(__dirname, '../../frontend/admin/admin.html'));
    } else {
        res.redirect('/login');
    }
};

exports.listarAdmins = async (req, res) => {
    try {
        const result = await query(
            'SELECT adm.admin_id, acc.account_name, acc.account_email, adm.admin_canmanageusers, adm.admin_canmanageposts ' +
            'FROM app_admin adm, account acc WHERE adm.admin_id = acc.unique_username ORDER BY adm.admin_id'
        );
        res.json({ sucesso: true, admins: result.rows });
    } catch (error) {
        console.error('Erro ao listar administradores:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
};

exports.criarAdmin = async (req, res) => {
    try {
        const { admin_id, admin_canManageUsers, admin_canManagePosts } = req.body;

        if (!admin_id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O ID do administrador (username) é obrigatório'
            });
        }

        const result = await query(
            'INSERT INTO app_admin (admin_id, admin_canmanageusers, admin_canmanageposts) VALUES ($1, $2, $3) RETURNING *',
            [admin_id, admin_canManageUsers || false, admin_canManagePosts || false]
        );

        res.status(201).json({ sucesso: true, admin: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar administrador:', error);

        if (error.code === '23502') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Dados obrigatórios não fornecidos'
            });
        }

        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
};

exports.obterAdmin = async (req, res) => {
    try {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({ sucesso: false, mensagem: 'Username é obrigatório' });
        }

        const result = await query(
            'SELECT * FROM app_admin WHERE admin_id = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Administrador não encontrado' });
        }

        res.json({ sucesso: true, admin: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter administrador:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
};

exports.atualizarAdmin = async (req, res) => {
    try {
        const username = req.params.username;
        const { admin_canManageUsers, admin_canManagePosts } = req.body;

        const existingAdminResult = await query(
            'SELECT * FROM app_admin WHERE admin_id = $1',
            [username]
        );

        if (existingAdminResult.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Administrador não encontrado' });
        }

        const currentAdmin = existingAdminResult.rows[0];

        const updatedFields = {
            admin_canmanageusers: admin_canManageUsers !== undefined ? admin_canManageUsers : currentAdmin.admin_canmanageusers,
            admin_canmanageposts: admin_canManagePosts !== undefined ? admin_canManagePosts : currentAdmin.admin_canmanageposts
        };

        const updateResult = await query(
            'UPDATE app_admin SET admin_canmanageusers = $1, admin_canmanageposts = $2 WHERE admin_id = $3 RETURNING *',
            [updatedFields.admin_canmanageusers, updatedFields.admin_canmanageposts, username]
        );

        res.json({ sucesso: true, admin: updateResult.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar administrador:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
};

exports.deletarAdmin = async (req, res) => {
    try {
        const username = req.params.username;

        const existingAdminResult = await query(
            'SELECT * FROM app_admin WHERE admin_id = $1',
            [username]
        );

        if (existingAdminResult.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Administrador não encontrado' });
        }

        await query(
            'DELETE FROM app_admin WHERE admin_id = $1',
            [username]
        );

        res.json({ sucesso: true, mensagem: 'Administrador excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar administrador:', error);

        if (error.code === '23503') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Não é possível deletar administrador com dependências associadas'
            });
        }

        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
};