const { query } = require('../database');
const path = require('path');

exports.abrirCrudAccount = (req, res) => {
    const usuario = req.cookies ? req.cookies.usuarioLogado : null;
    if (usuario) {
        res.sendFile(path.join(__dirname, '../../frontend/account/account.html'));
    } else {
        res.redirect('/login');
    }
};

exports.listarAccounts = async (req, res) => {
    try {
        const result = await query('SELECT * FROM account ORDER BY unique_username');
        res.json({ sucesso: true, accounts: result.rows });
    } catch (error) {
        console.error('Erro ao listar contas:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Internal error in the server' });
    }
};

exports.criarAccount = async (req, res) => {
    try {
        const { unique_username, account_name, account_email } = req.body;

        if (!unique_username || !account_name || !account_email) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'username, name and e-mail are required.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(account_email)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Formato de e-mail inválido'
            });
        }

        const result = await query(
            'INSERT INTO account (unique_username, account_name, account_email) VALUES ($1, $2, $3) RETURNING *',
            [unique_username, account_name, account_email]
        );

        res.status(201).json({ sucesso: true, account: result.rows[0] });
    } catch (error) {
        console.error('Erro whilst creating account:', error);

        if (error.code === '23505') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Name or email already in use'
            });
        }

        if (error.code === '23502') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Required data not filled'
            });
        }

        res.status(500).json({ sucesso: false, mensagem: 'Internal error in the server' });
    }
};

exports.obterAccount = async (req, res) => {
    try {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({ sucesso: false, mensagem: 'Username is required' });
        }

        const result = await query(
            'SELECT * FROM account WHERE unique_username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'User not found' });
        }

        res.json({ sucesso: true, account: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter conta:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Internal error in server' });
    }
};

exports.atualizarAccount = async (req, res) => {
    try {
        const username = req.params.username;
        const { account_name, account_email } = req.body;

        if (account_email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(account_email)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Incorrect email adress'
                });
            }
        }

        const existingAccountResult = await query(
            'SELECT * FROM account WHERE unique_username = $1',
            [username]
        );

        if (existingAccountResult.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'User not found' });
        }

        const currentAccount = existingAccountResult.rows[0];

        const updatedFields = {
            account_name: account_name !== undefined ? account_name : currentAccount.account_name,
            account_email: account_email !== undefined ? account_email : currentAccount.account_email
        };

        const updateResult = await query(
            'UPDATE account SET account_name = $1, account_email = $2 WHERE unique_username = $3 RETURNING *',
            [updatedFields.account_name, updatedFields.account_email, username]
        );

        res.json({ sucesso: true, account: updateResult.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar conta:', error);

        if (error.code === '23505') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'E-mail is already being used by other person'
            });
        }

        res.status(500).json({ sucesso: false, mensagem: 'Internal error in the server' });
    }
};

exports.deletarAccount = async (req, res) => {
    try {
        const username = req.params.username;

        const existingAccountResult = await query(
            'SELECT * FROM account WHERE unique_username = $1',
            [username]
        );

        if (existingAccountResult.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'User not found' });
        }

        await query(
            'DELETE FROM account WHERE unique_username = $1',
            [username]
        );

        res.json({ sucesso: true, mensagem: 'The account has been deleted succesfully' });
    } catch (error) {
        console.error('Error whilst trying to delete the account:', error);

        if (error.code === '23503') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Delete the posts of the user before proceeding witht the exclusion.'
            });
        }

        res.status(500).json({ sucesso: false, mensagem: 'Internal error in the server' });
    }
};