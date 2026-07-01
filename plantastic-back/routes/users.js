const express = require('express')
const bcrypt = require('bcrypt')
const userRepository = require('../repositories/userRepository')

const router = express.Router()
const SALT_ROUNDS = 10

router.post('/register', async (req, res) => {
  try {
    const { name, lastname, email, phone, password } = req.body

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben completarse.' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El correo electrónico no es válido.' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' })
    }

    if (phone && !/^\d{8}$/.test(phone)) {
      return res.status(400).json({ message: 'El teléfono debe tener exactamente 8 dígitos.' })
    }

    const exists = await userRepository.findByEmail(email)
    if (exists) {
      return res.status(409).json({ message: 'Ya existe una cuenta con ese correo electrónico.' })
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS)

    await userRepository.create({
      name: name.trim(),
      lastname: lastname.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      password: hash
    })

    return res.status(201).json({ message: '¡Cuenta creada exitosamente!' })

  } catch (err) {
    console.error('Error en /register:', err.message)
    return res.status(500).json({ message: 'Error interno del servidor. Intenta de nuevo más tarde.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' })
    }

    const usuario = await userRepository.findByEmail(email.trim().toLowerCase())

    if (!usuario) {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' })
    }

    const coincide = await bcrypt.compare(password, usuario.password)
    if (!coincide) {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' })
    }

    const { password: _hash, ...usuarioSeguro } = usuario

    req.session.user = usuarioSeguro
    req.session.cart = req.session.cart || []

    return res.status(200).json({
      message: '¡Sesión iniciada correctamente!',
      usuario: usuarioSeguro
    })

  } catch (err) {
    console.error('Error en /login:', err)
    return res.status(500).json({ message: 'Error interno del servidor. Intenta de nuevo más tarde.' })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid')
    res.json({ message: 'Sesión cerrada' })
  })
})

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'No hay sesión activa' })
  }
  return res.json(req.session.user)
})

router.put('/profile', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'No autenticado' })

  try {
    const { name, lastname, phone } = req.body

    if (!name || !name.trim() || !lastname || !lastname.trim()) {
      return res.status(400).json({ message: 'Nombre y apellido son obligatorios.' })
    }
    if (phone && !/^\d{8}$/.test(phone)) {
      return res.status(400).json({ message: 'El teléfono debe tener exactamente 8 dígitos.' })
    }

    const updated = await userRepository.updateByEmail(req.session.user.email, {
      name: name.trim(),
      lastname: lastname.trim(),
      phone: phone ? phone.trim() : ''
    })
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado.' })

    const { password: _hash, ...usuarioSeguro } = updated
    req.session.user = usuarioSeguro
    return res.json({ message: 'Perfil actualizado.', usuario: usuarioSeguro })
  } catch (err) {
    console.error('Error en PUT /profile:', err)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

router.put('/address', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'No autenticado' })

  try {
    const { provincia, direccion, codigoPostal } = req.body

    if (codigoPostal && !/^\d{5}$/.test(codigoPostal)) {
      return res.status(400).json({ message: 'El código postal debe tener 5 dígitos.' })
    }

    const updated = await userRepository.updateByEmail(req.session.user.email, {
      provincia: provincia || '',
      direccion: direccion || '',
      codigoPostal: codigoPostal || ''
    })
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado.' })

    const { password: _hash, ...usuarioSeguro } = updated
    req.session.user = usuarioSeguro
    return res.json({ message: 'Dirección guardada.', usuario: usuarioSeguro })
  } catch (err) {
    console.error('Error en PUT /address:', err)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

module.exports = router