const express = require('express')
const path = require("path")
const mongoose = require('mongoose')

const Contact = require('./models/Contact')

const app = express()
const port = 3000

//Mongodb connection
mongoose.connect('mongodb://localhost:27017/fitzone')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/index.html"))
})

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/about.html"))
})

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/services.html"))
})

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/contact.html"))
})

// POST route (form handling)
app.post('/contact', async (req, res) => {
  try {
    console.log(req.body)   // 🔥 ADD THIS

    if (![req.body.firstName, req.body.lastName, req.body.email, req.body.message].every(value => value && value.trim())) {
      return res.status(400).json({ message: 'Please complete all required fields.' })
    }

    const newContact = new Contact({
      name: `${req.body.firstName.trim()} ${req.body.lastName.trim()}`,
      email: req.body.email,
      phone: req.body.phone,
      interest: req.body.interest,
      message: req.body.message
    })

    await newContact.save()

    console.log("Saved to DB")   // 🔥 ADD THIS

    res.status(201).json({ message: 'Thanks — your message has been sent.' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'We could not send your message. Please try again shortly.' })
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
