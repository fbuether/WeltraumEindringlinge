

build:
	node ./node_modules/.bin/webpack


dev:
	node ./node_modules/.bin/webpack-dev-server



.PHONY: build dev
