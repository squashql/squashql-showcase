## Prerequisites

In order to build the server, you will need:
- [Java JDK](https://www.oracle.com/java/) >= 17
- Latest stable [Apache Maven](http://maven.apache.org/)

## Run locally

- Install prerequisites (see above)
- Build the project
```
mvn clean install -DskipTests -Pspring-boot
```
- Launch the project with the following command. Replace `/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java`
  by your java path if necessary.
```
/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java --add-opens=java.base/sun.nio.ch=ALL-UNNAMED -Ddataset.path=saas.csv -jar target/aitm-sandbox-1.0.0.jar
```
Do not forget to change the path to the file in the above command: `-Ddataset.path=/Users/paul/Downloads/saas.csv`

Server address is: `http://localhost:8080`
