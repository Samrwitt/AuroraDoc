# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 make g++ openssl
COPY package*.json ./
RUN npm ci
COPY . .

ENV PRISMA_CLI_QUERY_ENGINE_TYPE=library
RUN npx prisma generate --schema=./prisma/schema.prisma \
 && node -e "require('@prisma/client'); console.log('prisma client ok')"

RUN npm run build

# ---- run stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
# non-root user
# RUN addgroup -S aurora && adduser -S aurora -G aurora
# USER aurora
# expose HTTP
EXPOSE 8080
CMD ["node", "dist/src/main.js"]
