FROM --platform=linux/arm64 node:18.17.1-bullseye-slim as build

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/app

ENV NODE_ENV=development
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY .yarn ./.yarn
COPY yarn.lock package.json .yarnrc.yml ./

RUN yarn install --immutable

COPY tsconfig.json ./
COPY src ./src

RUN yarn build

ENV NODE_ENV=production

# install dependencies with frozen lockfile
# then clean with node prune
RUN yarn install --immutable

# install node prune
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

FROM --platform=linux/arm64 node:18.17.1-bullseye-slim

RUN apt-get update \
     && apt-get install -y wget gnupg ca-certificates procps libxss1 \
     && apt-get update \
     # For ARM, google-chrome-stable is not available
     # and M1 failed to emulate the chrome browser.
     # thus we use chromium for this
     && apt-get install -y chromium \
     # Font installation, support chinese, japanese, korean, hindi, and thai for now
     && apt-get install -y fonts-wqy-zenhei fonts-indic fonts-noto fonts-noto-cjk fonts-thai-tlwg-ttf \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/app

ENV PORT=3000
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY --from=build /usr/local/app/node_modules ./node_modules
COPY --from=build /usr/local/app/.yarn ./.yarn
COPY --from=build /usr/local/app/build ./
COPY yarn.lock package.json .yarnrc.yml ./

CMD node index.js
