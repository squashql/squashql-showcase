#!/bin/bash

SQUASHQL_TS_PATH=/code/squashql-ts
if [ -d "$SQUASHQL_TS_PATH" ]; then
    echo 'Directory exists'
else
    cp -r squashql-ts $SQUASHQL_TS_PATH
	npm i --prefix $SQUASHQL_TS_PATH
fi

SQUASHQL_UI_PATH=/code/squashql-ui-starter
if [ -d "$SQUASHQL_UI_PATH" ]; then
    echo 'Directory exists'
else
    cp -r squashql-ui-starter $SQUASHQL_UI_PATH
	npm i --prefix $SQUASHQL_UI_PATH
fi

# Start the first process
java -jar /opt/app/squashql-showcase-1.0.0.jar &

# Start the second process
code-server --user-data-dir /data /code --bind-addr 0.0.0.0:9090 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
