require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./src/app')

const PORT = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })

  server.setTimeout(5000) // 5 segundos de tiempo de espera

})
  .catch((err) => {
    console.error('Database connection error:', err)
  })
