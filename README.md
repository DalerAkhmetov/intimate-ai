## Требования

1. Node.js версии ``>=16.0.0 <17.0.0``

2. Менеджер пакетов ``Yarn``

## Создание билда

1. Меняем название файла ``.env.example`` на ``.env``;

2. Устанавливаем пакеты командой ``yarn``;

3. Запускаем сборку билда командой ``yarn build``;

4. Копируем содержимое сгенерированной папки ``dist`` на сервер.

## Назначение ENV переменных

``CALLBACK_REQUEST_ENDPOINT_API`` - ссылка на запросы для отправки форм

``CALLBACK_REQUEST_TOKEN`` - токен запроса авторизации (можно сгенерировать здесь - https://www.debugbear.com/basic-auth-header-generator)

``MAIN_LINK`` - ссылка на телеграм для кнопок **"Start chatting"**, **"View more"** и **"Try it now"**

``MAIN_LINK_COOKIE_EXPIRES`` - время жизни **cookie** параметров для главной ссылки (на телеграм), в днях

``SOCIAL_FACEBOOK`` - ссылка на **Facebook**

``SOCIAL_INSTAGRAM`` - ссылка на **Instagram**

``SOCIAL_TWITTER`` - ссылка на **Twitter**

``SOCIAL_YOUTUBE`` - ссылка на **Youtube**

``PRIVACY_POLICY_LINK`` - ссылка **"Privacy Policy & Cookies"** в подвале сайте

``LEGAL_NOTICE_LINK`` - ссылка **"Legal Notice"** в подвале сайта

``CONTACT_EMAIL`` - контактная почта
