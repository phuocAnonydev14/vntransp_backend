FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN apk update && \
    apk add --no-cache tzdata && \
    cp -p /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime && \
    apk del tzdata
RUN apk update && \
    apk add --no-cache \
    vim
RUN npm install glob rimraf @nestjs/cli
RUN npm install --only=development

COPY . .
RUN npm run build

## 
FROM builder AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["npm", "run", "start:prod"]