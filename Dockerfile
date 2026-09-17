# syntax=docker/dockerfile:1

# ---- deps: install dependencies exactly as locked in package-lock.json ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: compile the Next.js app (output: "standalone") ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# WPGRAPHQL_ENDPOINT is a public API URL, not a secret -- it's needed here too
# (not just at container-run time) because several routes are statically
# prerendered at build time and need to reach the real backend to bake in
# real content, rather than the empty/fallback state a failed fetch produces.
ARG WPGRAPHQL_ENDPOINT
ENV WPGRAPHQL_ENDPOINT=$WPGRAPHQL_ENDPOINT
RUN npm run build

# ---- runner: minimal production image ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Run as a non-root user rather than root, inside the container.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone output does not include public/ or .next/static -- copy them in explicitly.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
