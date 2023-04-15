localhost:8080 でアクセス可能

※省略可能
/ui に Nuxt3 のプロジェクトを作成
/api に Laravel8 以上のプロジェクト作成

##作業は ArticleMarcket/clientがルートです。

/uiで以下のコマンドを実行し、node_moduelを作成させる
```
npm install
```

以下のコマンドで Docker 起動
```
docker-compose up -d --build
```

Docker が起動したら初期設定として DB にアクセスする

```
docker-compose exec db bash

#bash mysql -u dev -p
password:password
```

Laravelにenvファイルを作成する
```
cp api/.env.example api/.env
```

Laravelにキーを作成
```
docker-compose exec api php artisan key:generate
```

DB 接続確認
```
docker-compose exec api php artisan migrate
```

laravelコンテナでサーバーを起動してあげる
```
docker-compose exec api composer install
```
