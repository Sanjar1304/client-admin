#stage 1
FROM node:20 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/client-admin/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200

#dev
#docker build -t 10.226.99.100:5050/uz.tenge.tune/tune_root/tengefront:latest .
#prod
#docker build -t 10.226.99.100:5050/uz.tenge.tune/tune_root/tengefront:prod.0.0.xx .
