# ETAPA 1: Construcción (Build)
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Esto genera la carpeta /dist con tu código optimizado
RUN npm run build 

# ETAPA 2: Servidor de Producción (Nginx)
FROM nginx:stable-alpine AS production-stage
# Copiamos la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiamos los archivos estáticos generados en la Etapa 1
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]