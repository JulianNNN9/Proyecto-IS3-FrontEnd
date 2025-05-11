# Etapa de construcción (builder)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=builder /app/dist/laos /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  # ¡Asegúrate de que esta línea sea correcta!
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]