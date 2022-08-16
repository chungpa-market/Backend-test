// routes/page.js

// GET /profile, GET /join, GET / - 총 3개의 페이지로 구성

/*
[자신의 프로필은 로그인을 해야 볼 수 있음 - isLoggedIn 사용]
- req.isAuthenticated() = true(로그인 중)여야 next 호출되어 res.render가 있는 미들웨어로 넘어갈 수 있음
- false(로그인 하지 않음)라면 로그인 창이 있는 메인 페이지로 리다이렉트 됨
*/

/*
[회원가입 페이지는 로그인 하지 않은 사람에게만 보여야 함 - isNotLoggedIn 사용]
- req.isAuthenticated() = false일 때만 next 호출하도록 함
*/

const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;  // 주목 - 넌적스에서 user 객체를 통해 사용자 정보에 접근할 수 있게 함
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - chungpa-market' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - chungpa-market' });
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('main', {
    title: 'chungpa-market',
    twits,
  });
});

module.exports = router;