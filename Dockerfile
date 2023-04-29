# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY ./dist ./

# Runtime stage
FROM node:18-alpine

ENV NODE_ENV production
ENV DB_HOST_PROD 
ENV DB_USER_PROD 
ENV DB_PASSWORD_PROD 
ENV DB_DATABASE_PROD 
ENV DB_HOST_LOCAL 
ENV DB_USER_LOCAL 
ENV DB_PASSWORD_LOCAL 
ENV DB_DATABASE_LOCAL 
ENV JWT_KEY 
ENV DB_PORT 

COPY --from=builder /app /app
WORKDIR /app
EXPOSE 5000
CMD [ "node", "main" ]
