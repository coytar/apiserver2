// dependencies
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// connect to database
const conn = mongoose.createConnection('mongodb://10.1.44.21/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create Model
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  visits: Number,
});
// Export Model
userSchema.plugin(passportLocalMongoose);

const User = conn.model('userData', userSchema, 'userData');

function incrementVisits(name) {
    User.findOne({ username: name }, function (err, usr) {
        if (err) return console.error(err);
        User.updateOne({ username: name }, { visits: usr.visits+1 }, function (err, res) {
            if (err) return console.error(err);
        });
    });
}

module.exports = { 
    model: User,
    incrementVisits: incrementVisits
};

// const UserDetails = mongoose.model('userData', User, 'userData');
// UserDetails.register({ username: 'candy', active: false, visits: 0 }, 'cane');
// UserDetails.register({ username: 'starbuck', active: false, visits: 0 }, 'redeye');
// UserDetails.register({ username: 'sherlock', active: false, visits: 0 }, 'holmes');