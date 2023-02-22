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

### UI 

Go to ui directory and execute
```bash
yarn install && yarn start
```
