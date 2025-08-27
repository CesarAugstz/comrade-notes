FROM node:20-alpine AS builder

ARG VITE_API_URL=http://localhost:8080
ARG VITE_API_URL_GRAPHQL=http://localhost:8080/graphql

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_URL_GRAPHQL=$VITE_API_URL_GRAPHQL

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 4173

CMD ["nginx", "-g", "daemon off;"]

