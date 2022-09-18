FROM node:18-alpine as base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 5173:80

CMD ["yarn", "run_server"]

