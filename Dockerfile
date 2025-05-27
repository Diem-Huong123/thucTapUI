
# Build React App
FROM node:16 AS build

WORKDIR /app

# Cài dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn & build
COPY . .
RUN npm run build

# Dùng Nginx để serve ứng dụng
FROM nginx:alpine

# Copy build React vào nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy cấu hình Nginx tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 80

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]