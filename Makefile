

build:
	node ./node_modules/.bin/webpack --env.mode development


dev:
	node ./node_modules/.bin/webpack-dev-server --env.mode development


release:
	node ./node_modules/.bin/webpack --env.mode production


.PHONY: build dev release
