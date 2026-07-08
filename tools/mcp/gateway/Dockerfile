FROM node:20-alpine

WORKDIR /app

# Install Fastify gateway dependencies and tsx for TypeScript execution
RUN npm install fastify@^5.7.4 @fastify/http-proxy@^11.0.0 tsx@^4.19.3

# Copy the TypeScript gateway server
COPY gateway/server.ts ./gateway/server.ts

ENV PORT=3000

CMD ["npx", "tsx", "gateway/server.ts"]
