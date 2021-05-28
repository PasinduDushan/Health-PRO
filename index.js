const express = require('express') //importing express
const app = express() //Making a new express app
const PORT = 80

app.set('view engine', 'ejs') //View engine or knows as front-end set to ejs

//Main page
app.get('/', (req, res) => {
  res.render('index')  
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