FROM node:16.4.2 as build

WORKDIR /usr/local/app

ENV NODE_ENV=development

COPY yarn.lock package.json .yarnrc.yml .pnp.cjs ./
COPY .yarn ./.yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

RUN yarn install --immutable --immutable-cache --check-cache

COPY tsconfig.json ./
COPY src ./src

RUN yarn build

FROM node:16.4.2

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

COPY yarn.lock package.json .yarnrc.yml .pnp.cjs ./
COPY --from=build /usr/local/app/.yarn ./.yarn
COPY --from=build /usr/local/app/build ./

CMD yarn node index.js
