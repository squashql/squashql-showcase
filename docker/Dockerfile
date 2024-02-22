FROM eclipse-temurin:17-jre

RUN apt update -y
RUN apt install sudo systemctl -y

ARG VERSION=4.20.1
ARG TARGETARCH
RUN curl -fOL https://github.com/coder/code-server/releases/download/v$VERSION/code-server_${VERSION}_${TARGETARCH}.deb
RUN sudo dpkg -i code-server_${VERSION}_${TARGETARCH}.deb

RUN curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
RUN apt install nodejs -y

RUN mkdir /opt/app
COPY target/squashql-showcase-1.0.0.jar /opt/app

#ADD ts /ts
#ADD ui /ui

COPY docker/config.yaml /root/.config/code-server/
COPY docker/startup.sh /startup.sh

CMD ["/startup.sh"]
