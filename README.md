# Context

This project shows you how to set up a SquashQL server with DuckDB as database and how to use and build client applications
in Typescript with the [SquashQL TypeScript SQL-like query builder](https://www.npmjs.com/package/@squashql/squashql-js). 

It is recommended to start with the Typescript tutorial to get your hands dirty before using the 
single page application built in React.

## Project structure

The project contains three parts:

- A server (SpringBoot app) written in Java; under `src/`
- A typescript command line application; under `ts/`. Read [TUTORIAL.md](./TUTORIAL.md) to understand how to use it.
- A small Next.js web application; under `ui` to demonstrate all the features SquashQL can offer and how to start building your own 
application.

## Typescript tutorial

> **Note**
> The tutorial can be done with Codespaces. No need to install anything on your computer!

Read [TUTORIAL.md](./TUTORIAL.md) to try SquashQL with a hands-on training.

## Run locally

### Prerequisites

In order to build the server, you will need:
- [Java JDK](https://www.oracle.com/java/) >= 17
- Latest stable [Apache Maven](http://maven.apache.org/)
- Latest LTS node version

### Server

- Install prerequisites (see above)
- Launch the project
```bash
mvn spring-boot:run
```

Server address is: `http://localhost:8080`
