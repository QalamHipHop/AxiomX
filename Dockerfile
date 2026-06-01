# --- Base Stage ---
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="\$PNPM_HOME:\$PATH"
RUN corepack enable
WORKDIR /app
COPY . .

# --- Build Stage ---
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# --- Production Stage (Backend) ---
FROM node:20-alpine AS backend
WORKDIR /app
RUN addgroup -S axiomx && adduser -S axiomx -G axiomx
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/package.json ./
COPY --from=build /app/node_modules ./node_modules
USER axiomx
EXPOSE 3001
CMD ["node", "dist/main.js"]

# --- Production Stage (Frontend) ---
FROM node:20-alpine AS frontend
WORKDIR /app
RUN addgroup -S axiomx && adduser -S axiomx -G axiomx
COPY --from=build /app/apps/frontend/.next ./.next
COPY --from=build /app/apps/frontend/public ./public
COPY --from=build /app/apps/frontend/package.json ./
COPY --from=build /app/node_modules ./node_modules
USER axiomx
EXPOSE 3000
CMD ["pnpm", "start"]
