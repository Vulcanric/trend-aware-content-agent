# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY frontend/package*.json ./
RUN npm install --omit=dev
ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "run", "start"]