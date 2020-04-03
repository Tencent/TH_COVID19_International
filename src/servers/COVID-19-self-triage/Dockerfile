FROM ubuntu:latest

# RUN sed -i 's/archive.ubuntu.com/mirrors.tencent.com/g' /etc/apt/sources.list

RUN apt-get update \
    && apt-get install -y python3-pip python3-dev \
    && cd /usr/local/bin \
    && ln -s /usr/bin/python3 python

ENV PYTHONPATH=/data/covid19_engine

RUN mkdir -p /data/covid19_engine
RUN mkdir -p /data/covid19_engine/log

COPY requirements.txt /data/
RUN pip3 install --upgrade pip -i https://mirrors.tencent.com/pypi/simple/ \
    && pip3 install -r /data/requirements.txt -i https://mirrors.tencent.com/pypi/simple/

COPY server /data/covid19_engine/server
WORKDIR /data/covid19_engine

EXPOSE 50051

ENTRYPOINT [ "python3", "server/service.py" ]

