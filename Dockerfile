FROM node:14.16.0 as build

WORKDIR /usr/local/app

ENV NODE_ENV=development

COPY yarn.lock package.json ./

RUN yarn install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN yarn build

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile

FROM node:14.16.0

RUN apt-get update \
     && apt-get install -y wget gnupg ca-certificates procps libxss1 \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     # We install Chrome to get all the OS level dependencies, but Chrome itself
     # is not actually used as it's packaged in the node puppeteer library.
     # Alternatively, we could could include the entire dep list ourselves
     # (https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
     # but that seems too easy to get out of date.
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/app

ENV PORT=3000
ENV NODE_ENV=production

COPY --from=build /usr/local/app/node_modules ./node_modules
COPY --from=build /usr/local/app/build ./

CMD node index.js
