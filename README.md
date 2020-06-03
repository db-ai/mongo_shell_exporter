# MongoDB Shell Exporter [![Build Status](https://travis-ci.org/db-ai/mongo_shell_exporter.svg?branch=master)](https://travis-ci.org/db-ai/mongo_shell_exporter)

Zero-dependency Prometheus exporter for MongoDB.

## Usage

Just download mongo_exporter.js from Releases and run it with `mongo` shell.

1. `curl https://github.com/db-ai/mongo_shell_exporter/releases/latest/download/mongo_exporter.js`
2. `mongo --quiet mongo_exporter.js`

You can pass other options, like authentication, port, host or connection uri as usual.

## Access control

If you use [Authentication](https://docs.mongodb.com/manual/core/authentication/), then you have to add an user account:

```
    db.getSiblingDB("admin").createUser({
      user: "mongodb_exporter",
      pwd: passwordPrompt(),
      roles: [
          { role: "clusterMonitor", db: "admin" },
          { role: "read", db: "local" }
      ]
    })
```

and then you can run exporter with new credentials:

```
  mongo --quiet mongo_exporter.js --username mongodb_exporter --password`
```

## Exporiting to Prometheus

You can export metrics to prometheus using one of the following methods:

### [Script Exporter](https://github.com/ricoberger/script_exporter) **(Recommended)**

Best way to export metrics from the `mongo_shell_exporter` is to install [`script_exporter`](https://github.com/ricoberger/script_exporter), and configure export task:

```
scripts:
  - name: mongo_shell_exporter
    script: mongo --quiet /path/to/mongo_exporter.js
```

Don't forget to enable authentication for your exporter.

### [Node Exporter](https://github.com/prometheus/node_exporter)

You can use [Textfile Collector] to periodically export metrics using scheduler.

Configure your scheduller to pereodically dump metrics to `--collector.textfile.directory`, for example:

```
mongo --quiet /path/to/mongo_exporter.js > /path/to/directory/mongo_shell_exporter.prom.$$
mv /path/to/directory/mongo_shell_exporter.prom.$$ /path/to/directory/mongo_shell_exporter.prom
```

**Note:** this method doesn't follow Prometheus recommendations. Read more [here](https://prometheus.io/docs/introduction/faq/#why-do-you-pull-rather-than-push)

### nc-based http *server*

You can find kind of *http server* example in `examples` folder. It uses `nc` to listen on port `9999` and return metrics each time someone is connected.

There is multiple caveats with this method as well:

1. Metics are collected way before connection is established and can be very stale
2. No authentication, authorization or access control of any kind
3. `nc` implementations can differ and it might be tricky to properly configure it
