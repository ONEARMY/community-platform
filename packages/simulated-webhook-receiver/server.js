/*global require, process, console*/

const express = require('express')

const app = express()

console.log('Starting server...')

app.use(express.json())

app.get('/health', (_, response) => {
  response.status(200).json({ status: 'success' })
})

const requests = []

app.get('/requests', (_, response) => {
  console.log('Returning requests...')
  response.status(200).json({ requests: requests })
})

app.get('*', (request, response) => handleRequest(request, response, 'GET'))
app.put('*', (request, response) => handleRequest(request, response, 'PUT'))
app.post('*', (request, response) => handleRequest(request, response, 'POST'))
app.delete('*', (request, response) =>
  handleRequest(request, response, 'DELETE'),
)

function handleRequest(request, response, method) {
  requests.push({
    method: method,
    url: request.url,
    body: request.body,
  })
  console.log('=============================')
  console.log('Request received!')
  console.log('Details:')
  console.log('URL: ' + request.originalUrl)
  console.log('method: ' + method)
  console.log('params: ' + JSON.stringify(request.params))
  console.log('body: ' + JSON.stringify(request.body))
  console.log('=============================')

  response.status(200).json({ status: 'success' })
}

const port = 30102

app.listen(port, () => {
  console.log('Server running on port: ' + port)
})

process.on('SIGINT', () => {
  console.log('Received termination signal...')
  process.exit()
})

process.on('exit', () => {
  console.log('Exiting... bye-bye!')
})
