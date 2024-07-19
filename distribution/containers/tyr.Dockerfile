# Use node alpine docker image
FROM docker.io/node:lts-alpine as builder

WORKDIR /app/

COPY . /app/

# Get specified version from npm
RUN npm install &&\
    npm run build

FROM docker.io/node:lts-alpine

# Install runtime dependencies
RUN apk --no-cache add \
    mediainfo \
    tini \
    coreutils

COPY --from=builder /app/package.json /app/dist/ /app/

WORKDIR /app/

RUN npm install --omit=dev

# Expose port 3000
EXPOSE 3000

# Flood
ENV FLOOD_OPTION_HOST="0.0.0.0"
ENTRYPOINT ["/sbin/tini", "--", "node", "--enable-source-maps", "--use_strict", "dist/index.js"]
