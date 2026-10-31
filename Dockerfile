FROM nginx:alpine
COPY index.html style.css script.js favoritos.js /usr/share/nginx/html/
EXPOSE 80