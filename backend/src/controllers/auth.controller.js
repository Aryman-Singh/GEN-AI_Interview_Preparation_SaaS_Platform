const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields"
      })
    }

    const isUserAlreadyExist = await userModel.findOne({$or: [{ email }, { username }]})
    if (isUserAlreadyExist) {
      return res.status(400).json({
        success: false,
        error: "User with this email or username already exists"
      })
    }

    const hashPassword = await bcrypt.hash(password, 12)

    const user = await userModel.create({
      username,
      email,
      password: hashPassword
    })
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    
    res.cookie("token", token,{
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 60 * 60 * 1000 // 1 hour
  })

    res.status(201).json({
      success: true,
      user:{
        id: user._id,
        username: user.username,
        email: user.email  
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

async function loginUserController(req, res) {
  const{email, password} = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Please provide email and password"
    })
  }

  const user = await userModel.findOne({ email })
  if (!user) {
    return res.status(400).json({
      success: false,
      error: "Invalid credentials"
    })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: "Invalid credentials1"
    })
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
  res.cookie("token", token,{
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 60 * 60 * 1000 // 1 hour
  })

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
}

async function logoutUserController(req, res) {
  const token = req.cookies.token
  if (token) {
    await tokenBlacklistModel.create({ token })
  }
  res.clearCookie("token")
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
}

async function getMeController(req, res) {

  const user=await userModel.findById(req.user.userId)
  res.status(200).json({
    message: "User data retrieved successfully",
    user: {id: user._id, username: user.username, email: user.email}
  })
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }