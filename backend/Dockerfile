FROM golang:latest
RUN mkdir /app 
COPY . /app/src
WORKDIR /app/src
ENV GOPATH=/app
# ENV GOBIN=/app/bin
RUN go get go.mongodb.org/mongo-driver/mongo
RUN go get go.mongodb.org/mongo-driver/mongo/options
RUN go get go.mongodb.org/mongo-driver/bson
RUN go build -o main .
# RUN adduser -S -D -H -h /app appuser
# USER appuser
CMD ["./main"]