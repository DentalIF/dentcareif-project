const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const authRoutes = require('./routes/authRoutes')
const serviceCategoryRoutes = require('./routes/serviceCategoryRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const doctorScheduleRoutes = require('./routes/doctorScheduleRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const patientRoutes = require('./routes/patientRoutes')
const contactRequestRoutes = require('./routes/contactRequestRoutes')
const phoneLeadRoutes = require('./routes/phoneLeadRoutes')
const adminRoutes = require('./routes/adminRoutes')

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'DentCare backend is working',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/service-categories', serviceCategoryRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/doctor-schedules', doctorScheduleRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/contact-requests', contactRequestRoutes)
app.use('/api/phone-leads', phoneLeadRoutes)
app.use('/api/admin', adminRoutes)

module.exports = app