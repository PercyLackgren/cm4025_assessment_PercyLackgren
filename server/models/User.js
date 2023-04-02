const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  }
});

UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;