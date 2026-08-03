const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

async function authUser (req, res, next) {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }
  const isBlacklistToken = await tokenBlacklistModel.findOne({ token })

  if (isBlacklistToken) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    })
  }
}

module.exports = { authUser }