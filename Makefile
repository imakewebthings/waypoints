build:
	coffee --compile waypoints.coffee 

compress:
	uglifyjs -o waypoints.min.js waypoints.js

.PHONY: build compress