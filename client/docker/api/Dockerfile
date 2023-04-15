FROM php:8.1-fpm-alpine

COPY docker/api/php.ini /usr/local/etc/php/
COPY docker/api/start.sh /var/www/
RUN chmod 744 /var/www/start.sh
WORKDIR /var/www/html

# Setup GD extension
RUN apk add --no-cache \
      freetype \
      libjpeg-turbo \
      libpng \
      freetype-dev \
      libjpeg-turbo-dev \
      libpng-dev \
    && docker-php-ext-configure gd \
      --with-freetype=/usr/include/ \
      --with-jpeg=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-enable gd \
    && apk del --no-cache \
      freetype-dev \
      libjpeg-turbo-dev \
      libpng-dev \
    && rm -rf /tmp/*

RUN apk add libzip-dev

RUN docker-php-ext-install pdo pdo_mysql zip bcmath


# install composer
RUN curl -sS https://getcomposer.org/installer | php -- --version=2.2.0 --install-dir=/usr/local/bin --filename=composer 


ENV TZ=Asia/Tokyo

EXPOSE 8000

CMD ["../start.sh"]