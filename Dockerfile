# ----------- Етап створення базового образу -----------
  FROM node:18-alpine AS base

  # ----------- Етап збірки фронтенду -----------
  FROM base AS frontend-build
  
  WORKDIR frontend/compressApp
  COPY frontend/compressApp/package*.json ./
  RUN npm install
  
  COPY frontend/compressApp/ .
  RUN npm run build
  
  # ----------- Етап бекенду -----------
  FROM base AS backend
  
  WORKDIR backend/
  COPY backend/package*.json ./
  RUN npm install
  
  COPY backend/ .
  
  # Копіюємо зібраний фронтенд у бекенд
  COPY --from=frontend-build /frontend/compressApp/dist/compress-app /backend/
  
  EXPOSE 5000
  CMD ["node", "server.js"]
  