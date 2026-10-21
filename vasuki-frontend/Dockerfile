# Stage 1: Build React application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:5000/api
ARG VITE_USE_DEMO_DATA=true

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_DEMO_DATA=$VITE_USE_DEMO_DATA

RUN npm run build


# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]