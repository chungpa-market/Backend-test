// routes/middlewares.js

// Passport는 req 객체에 isAuthenticated 메서드를 추가함
// 로그인 여부 검사하는 미들웨어를 넣어 로그인 여부에 따라 라우터 접근 권한을 달리 할 수 있다

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
    }
  };