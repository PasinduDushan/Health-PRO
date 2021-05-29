const express = require('express') //importing express
const app = express() //Making a new express app
const PORT = 80
const parser = require('body-parser')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env['API_KEY']);
const { auth, requiresAuth } = require('express-openid-connect');

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
app.set('view engine', 'ejs') //View engine or knows as front-end set to ejs

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env['SECRET'],
  baseURL: process.env['BASE_URL'],
  clientID: process.env['CLIENT_ID'],
  issuerBaseURL: process.env['ISSUER']
};
app.use(auth(config));

//Main page
app.get('/', (req, res) => {
  const accept = req.oidc.isAuthenticated()
  res.render('index', {
        accept: accept
  })  
})

app.get('/login', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  const user = req.oidc.user
  res.render('profile', {
        user: user
  })
});

app.post('/success', (req, res) => {
 const info = req.oidc.user
        console.log(info.name,
        req.body.name,
        req.body.long)
        const msg = {
  to: info.name,
  from: 'support@healthpro.ml', 
  subject: 'Confirmation',
  text: 'This is a confirmation email saying that your form is submitted successfully. Our team will get back to you soon!',
 }
 sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
        res.redirect('success')
})

app.get('/success', (req, res) => {
        res.render('success')
})

app.get('/videos', (req, res) => {
  res.render('videos')
})

app.get('/about-us', (req, res) => {
  res.render('about-us')
})

app.use(function (req, res, next) {
    res.status(404).render('404')
})

// Starting to listen from the PORT 
app.listen(PORT, () => {
    console.log('Online!!')
})