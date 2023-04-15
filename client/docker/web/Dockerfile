# 軽量らしいのでOSは、Alpine Linuxを選択
# https://hub.docker.com/_/httpd
FROM httpd:2.4-alpine
 
# timezoneをAsia/Tokyoに設定する
RUN apk update && \
    apk add bash &&\
    apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata
    
RUN  mkdir -p /usr/local/apache2/logs/httpd/
 
# コンテナの80番と8080番ポートを開く（8080はNuxt用）
EXPOSE 80 8080