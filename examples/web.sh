#!/bin/sh

EXPORTER_LISTEN_PORT=9999

cleanup ()
{
  kill -- -$$
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "Listening on port $EXPORTER_LISTEN_PORT"

while true; do { echo 'HTTP/1.0 200 OK\r\n'; mongo --quiet dist/mongo_exporter.js; } | nc -c -l -p $EXPORTER_LISTEN_PORT; done
