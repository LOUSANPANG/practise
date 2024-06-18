const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/login', (req, res) => {
  console.log(req.body)
  res.send('登录成功')
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})