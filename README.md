# Портфолио Анастасии — публикация на GitHub Pages

Сайт готов к публикации: сборка и установка программ не требуются.
Анимация одуванчиков, фотография и ссылка https://t.me/nnmerr сохранены.

1. Распакуйте ZIP на компьютере.
2. Создайте на GitHub новый публичный репозиторий, например nastya-portfolio.
3. Нажмите Add file → Upload files и перетащите ВСЕ распакованные файлы
   вместе с папкой assets. Загружайте содержимое архива, а не сам ZIP.
   index.html должен лежать в корне репозитория.
4. Нажмите Commit changes.
5. Откройте Settings → Pages.
6. В Source выберите Deploy from a branch.
7. Выберите ветку main, папку /(root) и нажмите Save.
8. Дождитесь завершения публикации. Адрес появится в разделе Pages.
   Обычно он выглядит так: https://ВАШ-ЛОГИН.github.io/nastya-portfolio/

Для проверки на компьютере используйте локальный HTTP-сервер,
например расширение Live Server в VS Code. При открытии index.html
двойным щелчком браузер может ограничить работу canvas-анимации.
На GitHub Pages это ограничение отсутствует.

Все пути относительные: сайт работает и в подпапке репозитория.
Не переименовывайте assets и не удаляйте изображения.

Документация GitHub:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
