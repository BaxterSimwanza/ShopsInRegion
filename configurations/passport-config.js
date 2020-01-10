const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {

    const user = getUserByEmail(email) //returns a user by the email or null if it doesn't exist
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) { //compare login password to existing password of existing user
        return done(null, user) //
      } else {
        return done(null, false, { message: 'Password incorrect' }) //return no error, false for mismatch, and a message
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser)) //we didn't add password because by default it requires password and we already set our input name to that
  passport.serializeUser((user, done) => done(null, user.id)) //serialize and store user in a session
  passport.deserializeUser((id, done) => { //se serialize our user to a single id
    return done(null, getUserById(id))
  })
}

module.exports = initialize