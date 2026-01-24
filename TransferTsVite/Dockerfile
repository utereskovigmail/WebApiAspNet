# ======================
# Stage 1: Build React
# ======================
FROM node:20-alpine AS build

# Робоча директорія
WORKDIR /app

# Копіюємо package.json і package-lock.json для кешування
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь проект
COPY . .

# Створюємо production build
RUN npm run build

# ======================
# Stage 2: Serve with Nginx
# ======================
FROM nginx:alpine

# Копіюємо dist з першого етапу
COPY --from=build /app/dist /usr/share/nginx/html

# За бажанням: додати свій nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Відкриваємо порт 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
