FROM node:alpine

WORKDIR /opt/mywebap

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
