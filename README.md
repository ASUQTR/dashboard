# Asuqtr Dashboard

Control interface to interact with the AUV remotely. The web page help control, monitor and debug the pool testing.

This project is using [Angular][2] version 10.2.

![Build Status](https://bamboo.asuqtr.com/plugins/servlet/wittified/build-status/DASH-WEB) [![Discord](https://discordapp.com/api/guilds/646378795703599115/widget.png)](https://discord.gg/TM5AcRh)

## Useful documentation

| Documentation                  |                           Link                            |
| :----------------------------- | :-------------------------------------------------------: |
| Official Angular documentation |                     [Angular Docs][2]                     |
| ASUQTR-specific documentation  | [Confluence Page](https://confluence.asuqtr.com/x/w4CNAg) |
| Angular CLI README             |                     [Angular CLI][1]                      |

# Table of contents

1. [Production](#production)
2. [Development](#development)

# Production

## How to build and publish the Docker image

1. Run `docker build -t docker-registry.asuqtr.com/asuqtr-dashboard:VERSION` to build the Docker image by replacing VERSION by the correct version tag you want (ex. 2.0.0, latest, pool-test, etc.).
2. Run `docker image push docker-registry.asuqtr.com/asuqtr-dashboard:VERSION` to push the newly built image to the ASUQTR Docker registry. Don't forget to replace VERSION by the correct version tag used during build process.

## How to use the published Docker image in a Docker container

1. Go to [ASUQTR's Docker Hub][3] and find the tag you want to use for the asuqtr-dashboard image ("latest" suggested)
2. Run `docker run -p 80:80 docker-registry.asuqtr.com/asuqtr-dashboard:latest` if you chose the latest tag
3. Access the asuqtr-dashboard via [localhost](http://localhost)

## How to use the published Docker image in Docker-Compose

1. Use the following docker-compose.yml:
```yaml
version: "3"
services:
    ros-master:
        image: docker-registry.asuqtr.com/ros-base:test
        container_name: ros-master
        ports:
            - "11311:11311"
        command:
            - roscore

    ros-bridge:
        image: docker-registry.asuqtr.com/ros-base:test
        container_name: ros-bridge
        environment:
            - "ROS_HOSTNAME=ros-bridge"
            - "ROS_MASTER_URI=http://ros-master:11311"
        ports:
            - "9090:9090"
        depends_on:
            - ros-master
        command:
            - roslaunch
            - --wait
            - rosbridge_server
            - rosbridge_websocket.launch

    asuqtr-dashboard:
        image: docker-registry.asuqtr.com/asuqtr-dashboard:test
        container_name: asuqtr-dashboard
        ports:
            - "80:80"
        depends_on:
            - ros-bridge
            - ros-master

```

2. Run `docker-compose up -d`
3. Open a browser and type `localhost`

# Development

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag
for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI README][1].

[1]: https://github.com/angular/angular-cli/blob/master/README.md
[2]: https://angular.io/docs
[3]: https://docker-hub.asuqtr.com
