const jsonServer = require("json-server");
const auth = require("json-server-auth");

const server = jsonServer.create();
const router = jsonServer.router("db.json");

// json-server-auth 需要 server.db 才能讀寫 users
server.db = router.db;

const middlewares = jsonServer.defaults();
server.use(middlewares);

// 解析 JSON body（註冊/登入用）
server.use(jsonServer.bodyParser);

// 掛上 auth：提供 /register、/login，並支援 JWT 驗證
server.use(auth);

// 其餘 CRUD 路由（products、categories、banners…）
server.use(router);

const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`JSON Server with auth is running on port ${PORT}`);
});
