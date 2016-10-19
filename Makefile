test: lint
	npm test

browser-test: lint
	npm run browserify-tests
	npm run test-browser

browser-dist:
	cp lib/index.js browser/fidelity-promise.js
	npm run minify
	tar cvf browser.tar browser
	gzip browser.tar

ci: lint
	npm run prepublish
	npm run docs
	npm run coverage
	npm run profile

lint: node_modules
	npm run lint

publish: test browser-test browser-dist publish-docs
	npm publish

publish-docs:
	./publish-docs.sh

clean:
	rm -rf node_modules coverage docs publish *.cpuprofile *.cpuprofile.txt *.cpuprofile.svg

node_modules: package.json
	npm install

.PHONY: node_modules