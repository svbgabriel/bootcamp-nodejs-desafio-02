const { User, Appointment } = require('../models')

class AppointmentController {
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)

    res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })

    return res.redirect('/app/dashboard')
  }

  async show (req, res) {
    const user = req.session.user

    var appointmentsAsProvider

    if (user.provider) {
      appointmentsAsProvider = await Appointment.findAll({
        where: { provider_id: user.id },
        include: [{ model: User, as: 'user', required: true }]
      })
    }

    const appointmentsAsUser = await Appointment.findAll({
      where: { user_id: user.id },
      include: [{ model: User, as: 'provider', required: true }]
    })

    const querys = user.provider
      ? {
        appointmentsAsProvider,
        appointmentsAsUser
      }
      : {
        appointmentsAsUser
      }

    res.render('appointments/show', querys)
  }
}

module.exports = new AppointmentController()
