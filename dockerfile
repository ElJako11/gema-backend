# Creación de la imagen "sucia" (builder)
FROM node:22-alpine AS builder

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY ./tsconfig.json ./
COPY ./src ./

RUN npm run build

# Creación del builder.
FROM node:22-alpine

WORKDIR /app

# Copio las dependencias para producción.
COPY ./package*.json ./
RUN npm install --production

COPY --from=builder /app/dist/ ./dist/src

EXPOSE 3000

CMD ["npm", "start"]
