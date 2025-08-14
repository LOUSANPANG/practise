const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/delay', (req, res) => {
  const ms = Number(req.query.ms) || 10000;

  setTimeout(() => {
    res.json({
      success: true,
      delayMs: ms,
      message: `处理完成，延迟 ${ms} ms`,
      time: new Date().toISOString()
    });
  }, ms);
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
