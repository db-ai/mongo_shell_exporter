#!/bin/sh

EXPORTER_LISTEN_PORT=9999
echo "Listening on port $EXPORTER_LISTEN_PORT"

while true
do
  echo -e "HTTP/1.0 200 OK\r\n\r\n$(mongo --quiet ../dist/mongo_exporter.js)" | nc -c -l -p $EXPORTER_LISTEN_PORT
done