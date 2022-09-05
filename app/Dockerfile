FROM node:16.17.0-alpine3.16

WORKDIR /app

ADD . /app

RUN yarn install

CMD ["yarn", "start"]

EXPOSE 8080
