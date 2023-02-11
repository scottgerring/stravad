# Build
FROM node:16.19 as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn 
COPY src/ src/
COPY public/ public/
COPY config-overrides.js .
COPY babelrc.json .
COPY tsconfig.json .
RUN yarn build 

# Release
FROM nginx:1.23.1
COPY --from=builder /app/build /usr/share/nginx/html
RUN chmod -R a+rx /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY start.sh /start.sh
ENTRYPOINT ["/start.sh"]
EXPOSE 80 