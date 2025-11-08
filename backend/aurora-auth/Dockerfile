# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 make g++ openssl
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- run stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# non-root user
RUN addgroup -S aurora && adduser -S aurora -G aurora
USER aurora
# expose HTTP
EXPOSE 8080
CMD ["node", "dist/main.js"]
