# linebotaizu

## git

### 自分がやったことを他人に送り込みたい場合

- git add .
- git commit -m "readme を編集"
- git push

### 他人がやったことを自分の環境に取り込みたい場合

- git pull

### server 起動方法

- https://developers.line.biz/ja/ で自分の LineBot の CHANNEL_SECRET、CHANNEL_ACCESS_TOKEN をコピーする
- .env ファイルに書き込む

- https://ngrok.com/　で自分のアクセストークンを確認する
- npx ngrok authtoken 先ほどのアクセストークン
- npm start
- npx ngrok http 3000