build: compile minify

compile:
	coffee --compile waypoints.coffee shortcuts/*/*.coffee

minify:
	uglifyjs -o waypoints.min.js waypoints.js
	uglifyjs -o shortcuts/infinite-scroll/waypoints-infinite.min.js shortcuts/infinite-scroll/waypoints-infinite.js
	uglifyjs -o shortcuts/sticky-elements/waypoints-sticky.min.js shortcuts/sticky-elements/waypoints-sticky.js

.PHONY: build compile minify