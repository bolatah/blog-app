FROM node:14

WORKDIR /

COPY package*.json yarn.lock ./

COPY .babelrc next.config.js ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]