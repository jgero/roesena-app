FROM golang:latest
RUN mkdir /app 
COPY . /app/
WORKDIR /app/src
ENV GOPATH=/app
ENV GOBIN=/app/bin
# RUN go get
RUN go get github.com/google/uuid golang.org/x/crypto/bcrypt go.mongodb.org/mongo-driver/mongo go.mongodb.org/mongo-driver/bson
RUN go build -o main .
# RUN adduser -S -D -H -h /app appuser
# USER appuser
CMD ["./main"]