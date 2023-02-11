frontend: frontend/src/* frontend/package.json frontend/yarn.lock
	cd frontend && yarn && yarn build 

frontend-image: 
	cd frontend && rm -rf node_modules && docker build . -t stravad-frontend 

fetch-image: fetch/*.rb fetch/Gemfile*
	cd fetch && docker build . -t stravad-fetch