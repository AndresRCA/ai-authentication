# Stage 1: Build the Angular App
FROM node:16-alpine AS build
WORKDIR /app

# copy frontend's folder content to /app
COPY . ./

# build the static files
RUN npm install
RUN npm run build

# Stage 2: Move dist files to nginx server's html root, copy local configuration and start running nginx
FROM nginx:1.25.3-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]