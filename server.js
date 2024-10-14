const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Conexão com o PostgreSQL
const pool = new Pool({
  user: 'simlab_user',
  host: 'dpg-cs6m685svqrc73dn32fg-a',
  database: 'simlab',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Verifica se o usuário é administrador
const isAdmin = (req, res, next) => {
  const userRole = req.body.role || 'user'; // Exemplo de como verificar o papel do usuário
  if (userRole === 'admin') {
    next();
  } else {
    res.status(403).send('Acesso negado');
  }
};

// Página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para o dashboard (somente admin vê "Usuários")
app.get('/dashboard', (req, res) => {
  const isAdminUser = req.query.admin === 'true'; // Verifica a permissão no query string
  res.sendFile(path.join(__dirname, 'dashboard.html'), (err) => {
    if (err) {
      res.status(500).send('Erro ao carregar o dashboard');
    } else {
      console.log(`Acesso ao dashboard, admin: ${isAdminUser}`);
    }
  });
});

// Rota para registrar usuários
app.post('/register', (req, res) => {
  const { fullName, birthDate, email, password } = req.body;

  // Lógica para armazenar no banco de dados
  pool.query(
    'INSERT INTO users (name, birthdate, email, password) VALUES ($1, $2, $3, $4)',
    [fullName, birthDate, email, password],
    (err, result) => {
      if (err) {
        console.error('Erro ao registrar o usuário', err);
        res.status(500).send('Erro ao registrar');
      } else {
        res.status(200).send('Usuário registrado com sucesso');
      }
    }
  );
});

// Rota para enviar link de recuperação de senha
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  const msg = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: 'Recuperação de Senha',
    text: 'Clique no link abaixo para redefinir sua senha:',
    html: '<strong>Clique no link abaixo para redefinir sua senha:</strong>',
  };

  sgMail
    .send(msg)
    .then(() => {
      res.status(200).send('E-mail de recuperação enviado');
    })
    .catch((error) => {
      console.error('Erro ao enviar e-mail', error);
      res.status(500).send('Erro ao enviar e-mail');
    });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
