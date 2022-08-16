// app.js

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');  // 추가

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');  // 추가
const { sequelize } = require('./models');
const passportConfig = require('./passport');  // 추가
// require('./passport/index.js')와도 같다
// 폴더 내의 index.js 파일은 require 시 이름 생략 가능함

const app = express();
passportConfig(); // 패스포트 설정 - 추가
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());  // 추가
// passport.initialize 미들웨어는 요청(req 객체)에 passport 설정을 심음
app.use(passport.session());  // 추가
// passport.session 미들웨어는 req.session 객체에 passport 정보를 저장함
/*
주의) req.session 객체는 express-session에서 생성하는 것이므로 
passport 미들웨어를 express-session 미들웨어보다 뒤에 연결해야 함!
*/

app.use('/', pageRouter);
app.use('/auth', authRouter);  // 추가

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

// 라우터에 현재 pageRouter만 있지만 추후에 더 추가할 것
// 라우터 이후에는 404 응답 미들웨어와 에러 처리 미들웨어 존재
// 마지막으로 앱을 8001번 포트에 연결