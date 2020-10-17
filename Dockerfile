FROM node:14.14.0-alpine

ADD . /app

WORKDIR /app

RUN npm install --registry=https://registry.npm.taobao.org

CMD ["npm", "run", "start"]

EXPOSE 3000