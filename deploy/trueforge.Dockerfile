FROM node:22-bookworm-slim
WORKDIR /app
RUN npm install -g @truefoundry/trueforge@0.1.4
COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY fixtures ./fixtures
COPY scripts ./scripts
COPY apps/loop-ui ./apps/loop-ui
RUN npm ci && npx tsc -p tsconfig.build.json && npm prune --omit=dev
ENV HOST=0.0.0.0 NODE_ENV=production STANDALONE=false LOOP_FIXTURE_PORT=8788
EXPOSE 10000
CMD ["node","dist/scripts/start-hosted-trueforge.js"]
