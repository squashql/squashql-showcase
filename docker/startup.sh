#!/bin/bash

mkdir -p code

SQUASHQL_TS_PATH=/code/ts
if [ -d "$SQUASHQL_TS_PATH" ]; then
    echo 'Directory exists'
else
    cp -r ts $SQUASHQL_TS_PATH
	npm i --prefix $SQUASHQL_TS_PATH
fi

SQUASHQL_UI_PATH=/code/ui
if [ -d "$SQUASHQL_UI_PATH" ]; then
    echo 'Directory exists'
else
    cp -r ui $SQUASHQL_UI_PATH
	npm i --prefix $SQUASHQL_UI_PATH
fi

# Start the first process
java --add-opens=java.base/sun.nio.ch=ALL-UNNAMED --add-opens=java.base/sun.util.calendar=ALL-UNNAMED -jar /opt/app/squashql-showcase-1.0.0.jar &

# Start the second process
code-server --user-data-dir /data /code --bind-addr 0.0.0.0:9090 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
