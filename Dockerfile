# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_AUTH_API_URL
ARG NEXT_PUBLIC_SUGGEST_API_URL
ARG NEXT_PUBLIC_GRAPHQL_API_URL
ARG NEXT_PUBLIC_NOTIFICATIONS_API_URL

# Set them as environment variables for the build
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL
ENV NEXT_PUBLIC_SUGGEST_API_URL=$NEXT_PUBLIC_SUGGEST_API_URL
ENV NEXT_PUBLIC_GRAPHQL_API_URL=$NEXT_PUBLIC_GRAPHQL_API_URL
ENV NEXT_PUBLIC_NOTIFICATIONS_API_URL=$NEXT_PUBLIC_NOTIFICATIONS_API_URL

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=development

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run the app
CMD ["node", "server.js"]