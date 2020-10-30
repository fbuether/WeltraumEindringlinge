

build:
	node ./node_modules/.bin/webpack --env.production --env.NODE_ENV=bar --optimize-minimize --progress


dev:
	node ./node_modules/.bin/webpack-dev-server



.PHONY: build dev
