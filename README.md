# NETWORK USAGE ANALYTICS SERVICE

## TECH STACK
* NodeJS
* PostgreSQL
* Docker
* Jest

## RUNNING LOCALLY

### PRE REQUISITES
1. Create a `.env` file with the required data ( `.env.sample` is given for convinience )

### DOCKER
If you have docker, we have a Dockerfile setup which can run the service locally

1. Build image - `docker build -t <container_name> .`
2. Run image - `docker run -d -p 8000:8000 <container_name>`

3. Update `.env` with the docker postgres properties
4. Run `node ingest.js` to populate db with default values

### NON DOCKER
If you do not have docker, run the following commands

1. `npm install`
2. `npm start`
3. `npm dev` (optional for local development equipped with nodemon)
6. `node ingest.js` to populate values in your docker container

## RUNNING TEST

> Tests aren't complete due to time constraints.

Run `npm test`