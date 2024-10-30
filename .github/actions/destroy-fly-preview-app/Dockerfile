FROM alpine

RUN apk add --no-cache curl jq

RUN curl -L https://fly.io/install.sh | FLYCTL_INSTALL=/usr/local sh

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]