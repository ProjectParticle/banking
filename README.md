# Local bank

Keep track of money or credit in your application.

## Installation

### Environment variables

#### NodeJS

| Name | Required | Default Value | Description |
|:-----|:--------:|---------------|:------------|
| NODE_ENV | YES |  | either dev, test or prod |

#### API server

| Name | Required | Default Value | Description |
|:-----|:--------:|---------------|:------------|
| AUTO_TRADER_RADAR_HTTP_SERVER_HOST | No | 0.0.0.0 | The hostname or IP address you want to listen on. |
| AUTO_TRADER_RADAR_HTTP_SERVER_PORT | No | 3000 | The port that API HTTP server listens on. |

#### Notification Channel

| Name | Required | Default Value | Description |
|:-----|:--------:|---------------|:------------|
| AUTO_TRADER_RADAR_REDIS_NOTIFICATION_CHANNEL_PUBLISH_TIMEOUT | No | 150 | Amount of time that publishing can be delayed. |

##### Redis

| Name | Required | Default Value | Description |
|:-----|:--------:|---------------|:------------|
| AUTO_TRADER_RADAR_REDIS_NOTIFICATION_CHANNEL_REDIS_URI | Yes | | A valid redis URI format. |

#### Crawler

| Name | Required | Default Value | Description |
|:-----|:--------:|---------------|:------------|
| AUTO_TRADER_RADAR_CRAWLER_UPDATE_INTERVAL | No | 150 | Amount of time that crawler extracts stock information from the web page. |

#### Logger

##### Syslog

> To see variables scope and their default values, please see [this](https://github.com/winstonjs/winston-syslog) link.

| Name | Required | Default Value | Description |
|:-----|:--------:|---------------|:------------|
| AUTO_TRADER_RADAR_LOGGER_INSTANCE_NAME | No | | - |
| AUTO_TRADER_RADAR_LOGGER_SYSLOG_HOST | Yes | | - |
| AUTO_TRADER_RADAR_LOGGER_SYSLOG_PROTOCOL | No | | . |
| AUTO_TRADER_RADAR_LOGGER_SYSLOG_PORT | Yes | | - |
| AUTO_TRADER_RADAR_LOGGER_SYSLOG_PATH | Yes | | - |
| AUTO_TRADER_RADAR_LOGGER_SYSLOG_LOCALHOST | No | | - |

### Docker

1. Build the image `$ docker build --tag auto-trader/radar .`.
2. Run a container `$ docker run --name auto-trader-radar-01 --env-file /path/to/.env -p 3000:3000 auto-trader/radar`.
