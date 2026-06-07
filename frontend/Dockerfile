# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Build the production bundle
COPY . .
RUN npm run build

# ---- Runtime stage (Nginx) ----
FROM nginx:1.27-alpine AS final

# SPA + /api reverse proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Angular (application builder) emits the browser app under dist/frontend/browser
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
