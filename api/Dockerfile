# syntax=docker/dockerfile:1
FROM golang:1.21

RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list
RUN apt-get update && apt-get install make

# Set destination for COPY
WORKDIR /app
COPY . .

CMD make build