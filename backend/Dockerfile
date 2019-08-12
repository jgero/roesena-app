FROM golang:latest
RUN mkdir /app 
COPY . /app/
WORKDIR /app/src
ENV GOPATH=/app
ENV GOBIN=/app/bin
RUN go get
RUN go build -o main .
# RUN adduser -S -D -H -h /app appuser
# USER appuser
CMD ["./main"]