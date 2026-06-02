# ==========================================
# Stage 1: Build environment
# ==========================================
FROM node:24-slim AS builder

# Install pnpm
RUN npm install -g pnpm@10

WORKDIR /app

# Copy root configurations and lock files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.base.json ./

# Copy all package.json files first to cache dependencies installation
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/hiti-tech/package.json ./artifacts/hiti-tech/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/db/package.json ./lib/db/
COPY lib/replit-auth-web/package.json ./lib/replit-auth-web/
COPY scripts/package.json ./scripts/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Run the build (typechecks and builds required applications and libraries)
RUN pnpm run typecheck:libs && \
    pnpm --filter @workspace/api-server run build && \
    pnpm --filter @workspace/hiti-tech run build

# Extract backend for deployment (copies backend and only production dependencies)
RUN pnpm --filter @workspace/api-server --prod --legacy deploy /app/deployed-api

# ==========================================
# Stage 2: Production API Runner
# ==========================================
FROM node:24-slim AS api-runner

WORKDIR /app

# Copy the deployed backend files and production node_modules from builder
COPY --from=builder /app/deployed-api /app

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]

# ==========================================
# Stage 3: Production Web Server
# ==========================================
FROM nginx:alpine AS web-runner

# Copy the Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend static files from builder
COPY --from=builder /app/artifacts/hiti-tech/dist/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
