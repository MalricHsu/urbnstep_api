# URBNSTEP 鞋子電商 API

以 `json-server` + `json-server-auth` 製作的假後端，內含商品資料與「註冊／登入」功能（bcrypt 密碼加密 + JWT token），可直接部署到 Render。

## 本機啟動

```bash
npm install
npm start
```

預設跑在 `http://localhost:3000`。

## 認證 API

| 方法 | 路徑 | Body | 說明 |
|---|---|---|---|
| POST | `/register` | `{ "email", "password", "name" }` | 註冊，回傳 `accessToken` + `user` |
| POST | `/login` | `{ "email", "password" }` | 登入，回傳 `accessToken` |

> `/signup`、`/signin` 為同義路徑。

註冊範例：

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"測試會員"}'
```

需要帶 token 的請求，在 header 加：

```
Authorization: Bearer <accessToken>
```

## 資料 API（CRUD）

| 路徑 | 說明 |
|---|---|
| `/products` | 商品列表（含 `images`、`colors`、`sizes`…） |
| `/products/1` | 單一商品 |
| `/products?categoryId=2` | 依分類篩選 |
| `/products?isNewArrival=true` | 新品 |
| `/products?onSale=true` | 特價 |
| `/categories` | 分類 |
| `/banners` | 首頁 banner |
| `/newProduct` `/hotProduct` | 新品 / 熱銷區塊圖 |
| `/inspirations` | Lookbook 圖 |
| `/favorites` `/cart` `/orders` | 收藏 / 購物車 / 訂單 |

支援分頁 `_page` `_limit`、排序 `_sort` `_order`、搜尋 `q=`。

## 部署到 Render

1. 把整個專案推到 GitHub（`node_modules` 已被 `.gitignore` 忽略）。
2. Render → **New +** → **Web Service** → 連結這個 repo。
3. 設定：
   - **Environment**：`Node`
   - **Build Command**：`npm install`
   - **Start Command**：`npm start`
   - **Instance Type**：Free 即可
4. Render 會自動帶入 `PORT` 環境變數，`server.js` 已讀取 `process.env.PORT`，不需手動設定。
5. 部署完成後網址類似 `https://urbnstep-api.onrender.com`。

### ⚠️ 注意：免費方案的資料不會永久保存

Render 免費方案的檔案系統是**暫時性**的。透過 `/register`、`/cart` 等寫入 `db.json` 的資料，會在服務**重新部署或休眠重啟後消失**，每次都回到 repo 裡的初始 `db.json`。

- 練習 / Demo：可接受。
- 要永久保存：可改接資料庫（如 MongoDB Atlas、Supabase），或在 Render 掛載付費 Disk。
