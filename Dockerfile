# ----------- Етап збірки фронтенду -----------
  FROM node:18-alpine AS frontend-build

  WORKDIR /frontend/compressApp
  
  COPY frontend/compressApp/package*.json ./
  
  RUN npm install
  
  COPY frontend/compressApp/ .
  
  RUN npm run build -- --configuration production
  
  # ----------- Етап бекенду -----------
  FROM node:18-alpine AS backend
  
  WORKDIR backend/
  
  COPY backend/package*.json ./
  
  RUN npm install
  
  COPY backend/ .
  
  # Копіюємо зібраний фронтенд у бекенд
  COPY --from=frontend-build /frontend/compressApp/dist/compress-app /backend/
  EXPOSE 5000
  
  CMD ["node", "server.js"]
  