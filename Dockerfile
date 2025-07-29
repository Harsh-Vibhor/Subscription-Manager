# Multi-stage build for production
FROM node:18-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

CMD ["npm", "start"]
