FROM node:22-alpine

# Create a non-root user and group
RUN addgroup appgroup && adduser -S -G appgroup appuser

# Set the working directory
WORKDIR /app

# Changing ownership of current /app workdir <user>:<group> <directory>
RUN chown -R appuser:appgroup .

# Switch to the non-root user
USER appuser

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

CMD ["npm", "start"]