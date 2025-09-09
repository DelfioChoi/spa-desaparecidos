<<<<<<< HEAD
# Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN ls -la && npm ci --verbose
COPY . .
RUN ls -la && npm run build

# Serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
=======
# Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
>>>>>>> 3369aef34e55057398b9190b20259bcd288e6447
CMD ["nginx", "-g", "daemon off;"]