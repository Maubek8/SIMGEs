const express = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());

// Rota de envio de e-mail
app.post('/send-email', (req, res) => {
  const { email, username } = req.body;

  const msg = {
    to: email,
    from: 'seu-email@dominio.com',
    subject: 'Confirmação de Cadastro',
    text: `Olá, ${username}. Confirme seu cadastro clicando no link abaixo.`,
    html: `<strong>Olá, ${username}. Confirme seu cadastro clicando no link abaixo.</strong>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      res.status(200).send('E-mail enviado com sucesso.');
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Erro ao enviar o e-mail.');
    });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
