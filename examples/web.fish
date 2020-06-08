#!/usr/local/bin/fish

set listen_port 9999
echo "Listening on port $listen_port"

while true
  set -l IFS
  echo -e "HTTP/1.0 200 OK\r\n\r\n"(mongo --quiet dist/mongo_exporter.js) | nc -c -l -p $listen_port
  set -e IFS
end
