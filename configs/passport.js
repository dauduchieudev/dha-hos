const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { user_name: username } });

      if (!user) {
        return done(null, false, { message: 'Sai tên đăng nhập!' });
      }

      if (password !== user.password) {
        return done(null, false, { message: 'Sai mật khẩu!' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize và deserialize user
passport.serializeUser((user, done) => {
  const sessionData = {
    id: user.user_id,
    role: user.role, 
  };
  done(null, sessionData);
});

passport.deserializeUser(async (sessionData, done) => {
  try {
    const user = await User.findByPk(sessionData.id);

    if (user) {
      user.role = sessionData.role;
      done(null, user);
    } else {
      done(null, false);
    }

  } catch (err) {
    done(err);
  }
});

module.exports = passport;
