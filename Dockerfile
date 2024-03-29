FROM node:12.22.5-buster-slim AS build-node-modules


WORKDIR /opt/app

COPY package*.json ./

RUN npm ci


##############################################

FROM node:12.22.5-buster-slim AS build-npm

COPY --from=build-node-modules /opt/app/node_modules node_modules

COPY ./ /opt/app

WORKDIR /opt/app

RUN NODE_ENV=production npm run build

##############################################

FROM node:12.22.5-buster-slim AS run


ENV NODE_ENV production

WORKDIR /opt/app

RUN addgroup --gid 500 --system twilio \
	&& adduser --uid 500 --system twilio \
	&& chown -R twilio:twilio /opt/app


COPY --from=build-node-modules /usr/local/bin /usr/local/bin
COPY --from=build-npm /opt/app/ ./

USER twilio

EXPOSE 3000

CMD [ "npm", "run", "start" ]