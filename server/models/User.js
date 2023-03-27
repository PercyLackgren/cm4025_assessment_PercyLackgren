// // models/user.js

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;


// const bcrypt = require("bcryptjs");
// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Define schema methods
// UserSchema.methods = {
// 	checkPassword: function (inputPassword) {
// 		return bcrypt.compareSync(inputPassword, this.password)
// 	},
// 	hashPassword: plainTextPassword => {
// 		return bcrypt.hashSync(plainTextPassword, 10)
// 	}
// }

// // Define pre-hooks for the save method
// UserSchema.pre('save', function (next) {
//     if (!this.password) {
//         console.log('models/user.js =======NO PASSWORD PROVIDED=======')
//         next()
//     } else {
//         console.log('models/user.js hashPassword in pre save');
//         this.password = this.hashPassword(this.password)
//         next()
//     }
// })

// module.exports = User = mongoose.model('users', UserSchema);