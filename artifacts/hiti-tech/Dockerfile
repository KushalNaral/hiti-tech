# Stage 1: Build the frontend
FROM node:20-alpine as builder
WORKDIR /app
# Install pnpm
RUN corepack enable && pnpm install --global pnp
# Copy dependency files
COPY package.json pnpm-lock.yaml ./
# Install dependencies
RUN pnpm install --frozen-lockfile
# Copy source code
COPY . .
# Build the application
RUN pnpm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
# Copy built assets from builder stage
COPY --from=builder /app/dist/public /usr/share/nginx/html
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]