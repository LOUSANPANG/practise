const express = require('express')
const app = express()


app.use((req, res, next) => {
  const referer = req.get('referer')
  if (referer) {
    const url = new URL(referer)
    url.hostname !== 'localhost' ? res.send('防盗链') : next()
  } else {
    res.send('防盗链')
  }
})

app.use(express.static(__dirname + '/public'))

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})