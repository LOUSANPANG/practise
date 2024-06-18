// user 子路由
const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.send('login page')
})
router.get('/register', (req, res) => {
  res.send('register page')
})

module.exports = router



// 主路由
const express = require('express')
const userRouter = require('./userRouter')

// userRouter.user()

const app = express()
app.use(userRouter)
