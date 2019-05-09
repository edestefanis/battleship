# Battleship

A very simple battleship in order to look at different js/ts technologies.

## Getting Started

The backend is basically a nodeJs server with express (not used much in this case) and a
model handled by GraphQL.

The frontend is an Angular app using some material design components. Really poor UI interface right now, 
I may spend some time in the future improving it, just for personal growth.


### Installing

This project assumes you have nodeJs installed. It has been tested with v10.15.3 (and npm v6.4.1).


#### Frontend
To run the backend on dev mode simply run npm install in the 'backend' directory and then start a dev server by: 

```
$ cd backend
$ npm install
$ npm run dev
```

#### Backend
To run the Angular frontend on dev mode, simply install all the packages and then use ng:

```
$ cd frontend
$ npm install
$ ng serve
```

You may also want to run this server remotely, and then need a proper server.
An alternative can be lite-server, just build the project and run the server pointing to the dist folder.

```
$ cd frontend
$ npm install lite-server
$ ng build --prod
$ lite-server --baseDir="dist/frontend"
```

## Running the tests

TODO(edestefanis): add some testing framework.
