# Context

This project shows you how to setup a SquashQL server with Spark as database and how to use and build client applications
in Typescript with the [SquashQL TypeScript SQL-like query builder](https://www.npmjs.com/package/@squashql/squashql-js). 

It is recommended to start with the Typescript tutorial to get your hands dirty before using the 
single page application built in React.

## Typescript tutorial

> **Note**
> The tutorial can be done with Codespaces. No need to install anything on your computer!

Read [TUTORIAL.md](./TUTORIAL.md) to try SquashQL with a hands-on training.

## Single-page application in React

> **Note**
> This React app project is not compatible with Codespaces like the Typescript tutorial. You'll have to 
> launch it locally and install all [required tools](#prerequisites).
 
Read [README.md](./ui/README.md) to see what can be built with SquashQL.


## Prerequisites

In order to build the server, you will need:
- [Java JDK](https://www.oracle.com/java/) >= 17
- Latest stable [Apache Maven](http://maven.apache.org/)
- Latest LTS node version

## Run locally

### Server

- Install prerequisites (see above)
- Launch the project
```bash
mvn spring-boot:run
```
If you want to use your own file you can change the path to the file like this: `-Ddataset.path=/Users/me/my-file.csv`

Server address is: `http://localhost:8080`
