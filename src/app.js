const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middlewares/errorHandler')
const userRoutes = require('./routes/userRoutes')

const app = express()

// Configura Helmet para mejorar la seguridad
app.use(helmet())

// Configura limitación de tasa
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por IP
  message: 'Too many requests from this IP, please try again later.',
})
app.use(limiter)

// Configura limitación de tasa de datos
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 100, // permite 100 solicitudes por IP
  delayMs: ()=> 500, // retrasa las siguientes solicitudes en 500ms
})
app.use(speedLimiter)

// Configura CSRF protection
app.use(cookieParser())
const csrfProtection = csurf({ cookie: true })

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/api/users', csrfProtection, userRoutes)

// Manejador de errores CSRF
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  res.status(403).json({ message: 'Invalid CSRF token' })
})

app.use(errorHandler)

module.exports = app
