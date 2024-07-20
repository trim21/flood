# Use node alpine docker image
FROM docker.io/node:lts-alpine

# Install runtime dependencies
RUN apk --no-cache add \
    mediainfo \
    tini \
    coreutils

COPY package.json package-lock.json /app/
COPY build /app/dist/

WORKDIR /app/

RUN npm install --ignore-scripts --omit=dev &&\
    npm cache clean --force


# Expose port 3000
EXPOSE 3000

# Flood
ENV FLOOD_OPTION_HOST="0.0.0.0"
ENTRYPOINT ["/sbin/tini", "--", "node", "--enable-source-maps", "--use_strict", "dist/index.js"]
