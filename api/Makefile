.PHONY: clean build 

build:
	go mod download
	go build -o server main.go

run: clean build
	./server

clean:
	rm -rf ./server
