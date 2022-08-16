// passport/index.js

// passport.serializeUser와 passport.deserializeUser가 바로 Passport 이해하는 핵심

const passport = require('passport');
const local = require('./localStrategy');
// localStrategy: 로컬 로그인 전략에 대한 파일
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // 로그인한 사용자 정보를 매개변수 user에 받고, done함수의 두 번째 인수에 user.id를 넘겨줌

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });
  // serializeUser에서의 user.id 데이터(세션에 저장했던 아이디)를 deserializeUser의 매개변수 id에 받고, done함수의 두 번째 인수에 넘겨줌 = 데이터베이스에서 사용자 정보 조회하는 것
  // 조회한 정보를 req.user에 저장함

  local();
};