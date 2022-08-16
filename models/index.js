// models/index.js

// 원래의 index.js에는 시퀄라이즈가 자동으로 생성한 코드들이 들어있음
// 그것을 다음과 같이 통째로 수정함
// 그럼으로써 각각의 모델들을 시퀄라이즈 객체에 연결함

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;