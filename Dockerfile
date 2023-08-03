FROM node:18-alpine as builder

LABEL stage=nodebuilder

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
  apk update --no-cache && apk add --no-cache ca-certificates git tzdata

WORKDIR /build/adminx-ui

RUN npm install -g pnpm && pnpm -v && pnpm config get registry

ADD package.json .
ADD pnpm-lock.yaml .
RUN pnpm install

COPY . .
RUN cat .env && pnpm run build && rm -rf node_modules && rm -rf src

FROM nginx:1.24.0-alpine-slim

COPY --from=builder /usr/share/zoneinfo/UTC /usr/share/zoneinfo/UTC
COPY --from=builder /usr/share/zoneinfo/Asia/Hong_Kong /usr/share/zoneinfo/Asia/Hong_Kong
ENV TZ Asia/Hong_Kong

WORKDIR /app

COPY --from=builder /build/adminx-ui/build /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
