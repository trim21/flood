# Use node alpine docker image
FROM docker.io/node:lts-alpine

COPY dist/ /app/dist/
COPY package.json package-lock.json /app/

# Get specified version from npm
RUN npm install --omit=dev &&\
    npm cache clean --force

# Install runtime dependencies
RUN apk --no-cache add \
    mediainfo \
    tini \
    coreutils

WORKDIR /app/src/

# Expose port 3000
EXPOSE 3000

# Flood
ENV FLOOD_OPTION_HOST="0.0.0.0"
ENTRYPOINT ["/sbin/tini", "--", "node", "--enable-source-maps", "--use_strict", "dist/index.js"]
