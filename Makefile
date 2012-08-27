build: compile minify

compile:
	coffee --compile waypoints.coffee shortcuts/*/*.coffee

minify:
	uglifyjs -o waypoints.min.js waypoints.js
	uglifyjs -o shortcuts/infinite/waypoints-infinite.min.js shortcuts/infinite/waypoints-infinite.js

.PHONY: build compile minify