# URBNSTEP 鞋子電商 API

以 [`json-server`](https://github.com/typicode/json-server) + [`json-server-auth`](https://github.com/jeremyben/json-server-auth) 打造的假後端，內含鞋子商品資料與「註冊／登入」功能（bcrypt 密碼加密 + JWT token）。適合前端練習、Demo，並可直接部署到 Render。

## 技術與需求

- Node.js 18+
- json-server `0.17.4`
- json-server-auth `2.1.0`

## 本機啟動

```bash
npm install
npm start        # 等同 npm run dev
```

預設跑在 `http://localhost:3010`（可用環境變數 `PORT` 覆寫）。

## 認證 API

| 方法 | 路徑 | Body | 說明 |
|---|---|---|---|
| POST | `/register` | `{ "email", "password", "name" }` | 註冊，回傳 `accessToken` + `user` |
| POST | `/login` | `{ "email", "password" }` | 登入，回傳 `accessToken` |

> `/signup`、`/signin` 為同義路徑。

註冊範例：

```bash
curl -X POST http://localhost:3010/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"測試會員"}'
```

需要帶 token 的請求，在 header 加上：

```
Authorization: Bearer <accessToken>
```

## 資料 API（CRUD）

所有資源皆支援 `GET / POST / PUT / PATCH / DELETE`。

| 路徑 | 說明 |
|---|---|
| `/products` | 商品列表（含 `images`、`colors`、`sizes`…） |
| `/products/1` | 單一商品 |
| `/products?categoryId=2` | 依分類篩選 |
| `/products?isNewArrival=true` | 新品 |
| `/products?isBestSeller=true` | 熱銷 |
| `/products?onSale=true` | 特價 |
| `/newProduct` | 首頁新品區塊圖 |
| `/hotProduct` | 首頁熱銷區塊圖 |
| `/categories` | 分類 |
| `/users` | 會員（密碼為 bcrypt 雜湊） |
| `/favorites` | 收藏 |
| `/cart` | 購物車 |
| `/orders` | 訂單 |

常用查詢參數：分頁 `_page` `_limit`、排序 `_sort` `_order`、全文搜尋 `q=`、範圍 `_gte` `_lte`。

範例：

```bash
# 第 1 頁、每頁 6 筆
curl "http://localhost:3010/products?_page=1&_limit=6"

# 依價格由低到高排序
curl "http://localhost:3010/products?_sort=price&_order=asc"
```

## 商品資料結構

每個 `products` 項目大致長這樣：

```jsonc
{
  "id": 1,
  "name": "Platform 404",
  "price": 2600,
  "originalPrice": 3200,
  "categoryId": 3,
  "categorySlug": "滑板鞋",
  "description": "...",
  "thumb": "縮圖網址",
  "images": ["圖 1", "圖 2", "..."],
  "colors": [
    { "name": "奶白", "code": "#F5F0E6" },
    { "name": "深藍", "code": "#1B2A4A" }
  ],
  "sizes": [
    { "eu": 35, "cm": 22.5, "inStock": false },
    { "eu": 36, "cm": 23,   "inStock": true }
  ],
  "stock": 3,
  "material": "鞋面／內裡／鞋底說明",
  "isNewArrival": true,
  "isBestSeller": true,
  "onSale": true
}
```

- `colors`：各商品有各自的顏色組合（`name` + hex `code`）。
- `sizes`：EU / 公分對照，`inStock` 標示各尺碼是否有貨（每個商品的缺貨尺碼不同）。

## 部署到 Render

1. 把整個專案推到 GitHub（`node_modules` 已被 `.gitignore` 忽略）。
2. Render → **New +** → **Web Service** → 連結這個 repo。
3. 設定：
   - **Environment**：`Node`
   - **Build Command**：`npm install`
   - **Start Command**：`npm start`
   - **Instance Type**：Free 即可
4. Render 會自動注入 `PORT` 環境變數，`server.js` 已讀取 `process.env.PORT`，不需手動設定。
5. 部署完成後網址類似 `https://urbnstep-api.onrender.com`。

### ⚠️ 注意：免費方案的資料不會永久保存

Render 免費方案的檔案系統是**暫時性**的。透過 `/register`、`/cart` 等寫入 `db.json` 的資料，會在服務**重新部署或休眠重啟後消失**，每次都回到 repo 裡的初始 `db.json`。

- 練習 / Demo：可接受。
- 要永久保存：可改接資料庫（如 MongoDB Atlas、Supabase），或在 Render 掛載付費 Disk。
