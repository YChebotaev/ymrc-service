FROM node:18-alpine3.17 as builder

WORKDIR /opt/ymrc-service

COPY knexfile.ts ./knexfile.ts
COPY tsconfig.json ./tsconfig.json
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY migrations/ ./migrations

RUN npm install --no-save
RUN npm run migrate

FROM node:18-alpine3.17

WORKDIR /opt/ymrc-service

COPY index.ts ./index.ts
COPY knexfile.ts ./knexfile.ts
COPY tsconfig.json ./tsconfig.json
COPY package.json ./package.json
COPY --from=builder /opt/ymrc-service/node_modules ./node_modules
COPY data/ ./data
COPY --from=builder /opt/ymrc-service/dev.sqlite3 ./dev.sqlite3

EXPOSE 3000

CMD ['npm', 'start']
