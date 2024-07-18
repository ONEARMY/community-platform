const express = require('express')
const app = express()

app.all('*', (req, res) => {
  res.status(501).json({ message: 'Not Implemented' })
})

const port = 80
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
