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

``MAIN_LINK_PARAM`` - название параметра для отправки ключа

``MAIN_LINK_COOKIE_EXPIRES`` - время жизни **cookie** параметров для главной ссылки (на телеграм), в днях

``SOCIAL_FACEBOOK`` - ссылка на **Facebook** (пустое значение - ссылка не отображается)

``SOCIAL_INSTAGRAM`` - ссылка на **Instagram** (пустое значение - ссылка не отображается)

``SOCIAL_TWITTER`` - ссылка на **Twitter** (пустое значение - ссылка не отображается)

``SOCIAL_YOUTUBE`` - ссылка на **Youtube** (пустое значение - ссылка не отображается)

``SOCIAL_TELEGRAM`` - ссылка на **Telegram** (пустое значение - ссылка не отображается)

``PRIVACY_POLICY_LINK`` - ссылка **"Privacy Policy & Cookies"** в подвале сайте

``LEGAL_NOTICE_LINK`` - ссылка **"Legal Notice"** в подвале сайта

``CONTACT_EMAIL`` - контактная почта

``TEAM_LINK`` - отображение ссылки на команду разработки (**true** или **false**)

``CF_ACCOUNT_ID`` - идентификатор аккаунта Cloudflare

``CF_NAMESPACE_ID`` - идентификатор namespace KV

``CF_BEARER_TOKEN`` - токен запроса авторизации Workers KV

``CF_DATA_EXPIRATION`` - время жизни записи данных Workers KV (в секундах)
