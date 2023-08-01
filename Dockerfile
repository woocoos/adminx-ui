FROM node:18-alpine as builder

LABEL stage=nodebuilder

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
  apk update --no-cache && apk add --no-cache ca-certificates git tzdata

WORKDIR /build/adminx-ui

RUN npm install -g pnpm && pnpm -v

ADD package.json .
ADD pnpm-lock.yaml .
RUN pnpm install --registry=http://nexus.hycapital.hk/repository/npm-group/

COPY . .
RUN cat .env
RUN pnpm run build

FROM nginx:1.24.0-alpine-slim

COPY --from=builder /usr/share/zoneinfo/UTC /usr/share/zoneinfo/UTC
COPY --from=builder /usr/share/zoneinfo/Asia/Hong_Kong /usr/share/zoneinfo/Asia/Hong_Kong
ENV TZ Asia/Hong_Kong

WORKDIR /app

COPY --from=builder /build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
