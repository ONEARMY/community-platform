import express from 'express'

const app = express()

app.all('*', (req, res) => {
  res.status(501).json({ message: 'Not Implemented' })
})

const port = 8080
app.listen(port, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server running on port ${port}`)
})
