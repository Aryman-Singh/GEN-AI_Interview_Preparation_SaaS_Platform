const mongoose =  require("mongoose")

const blacklistToken = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required"]
  } 
},{
    timestamps:true
})

const tokenBlacklistModel = mongoose.model("TokenBlacklist", blacklistToken)
module.exports = tokenBlacklistModel