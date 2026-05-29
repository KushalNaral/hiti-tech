# Stage 1: Build the backend
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
# Build the application (creates dist/index.mjs)
RUN pnpm run build

# Stage 2: Run the backend
FROM node:20-alpine
WORKDIR /app
# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
# Copy built code from builder stage
COPY --from=builder /app/dist ./dist
# Copy package.json for any scripts or metadata (optional but good practice)
COPY package.json ./
# Expose the port the app runs on
EXPOSE 3000
# Start the application
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]