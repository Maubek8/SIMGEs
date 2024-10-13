const express = require('express');
const bodyParser = require('body-parser');
const sendGrid = require('@sendgrid/mail');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configurar a chave da API do SendGrid
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar bodyParser para receber dados de formulários
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota para o formulário de registro
app.post('/register', (req, res) => {
    const { fullName, email, newPassword } = req.body;

    const message = {
        to: email,
        from: 'noreply@simges.com', // Substitua por seu endereço de e-mail de envio
        subject: 'Confirmação de Cadastro no SIMGEs',
        text: `Olá, ${fullName}! Obrigado por se registrar no SIMGEs.`,
        html: `<strong>Olá, ${fullName}!</strong><br>Obrigado por se registrar no SIMGEs. Sua conta foi criada com sucesso.`,
    };

    // Enviar e-mail usando SendGrid
    sendGrid
        .send(message)
        .then(() => {
            console.log('E-mail de confirmação enviado com sucesso.');
            res.status(200).send('Registro concluído! Verifique seu e-mail para confirmar.');
        })
        .catch((error) => {
            console.error('Erro ao enviar o e-mail:', error);
            res.status(500).send('Erro ao enviar e-mail de confirmação.');
        });
});

// Servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
