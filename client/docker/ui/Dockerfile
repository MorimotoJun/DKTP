FROM node:18.15.0
 
# 環境変数
ENV LANG C.UTF-8
ENV TZ Asia/Tokyo
ENV APP_HOME /app
ENV PATH ${APP_HOME}/node_modules/.bin:$PATH
ENV HOST 0.0.0.0
ENV PORT 3000
 
WORKDIR ${APP_HOME}
ADD ui ${APP_HOME}
 
    # apk アップデート
RUN npm update \
    && npm upgrade \
    && npm install \
    && rm -rf /var/cache/apk/*
 
EXPOSE ${PORT}
 
CMD ["npm", "run", "dev"]