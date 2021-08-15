FROM node:16-alpine3.11

WORKDIR /classclock

ADD package.json yarn.lock /classclock/
RUN yarn install
COPY . /classclock/

CMD  yarn run start:prod

