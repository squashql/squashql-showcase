## Prerequisites

In order to build the server, you will need:
- [Java JDK](https://www.oracle.com/java/) >= 17
- Latest stable [Apache Maven](http://maven.apache.org/)

## Run locally

### Server

- Install prerequisites (see above)
- Build the project
```bash
mvn clean install -DskipTests -Pspring-boot
```
- Launch the project with the following command. Replace `/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java`
  by your java path if necessary.
```bash
java --add-opens=java.base/sun.nio.ch=ALL-UNNAMED -jar target/squashql-showcase-1.0.0.jar
```
If you want to use your own file you can change the path to the file like this: `-Ddataset.path=/Users/me/my-file.csv`

Server address is: `http://localhost:8080`

### UI 
```bash
yarn install && yarn start
```
