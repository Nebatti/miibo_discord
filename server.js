import express from 'express'

const app = express()
const port = 3000

app.all('/', (req, res) => res.send('Result: OK'))

export default () => {
  app.listen(port, () => console.log('Server is now ready!'))
}
