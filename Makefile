build: compile minify

compile:
	coffee --compile waypoints.coffee 

minify:
	uglifyjs -o waypoints.min.js waypoints.js

.PHONY: build compile minify