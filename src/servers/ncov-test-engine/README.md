CovID-19 Self-screen Server 
====
![TENCENT Jarvis Lab logo](docs/static_files/JarvisLogo.png "The TENCENT Jarvis Lab")

Instructions
---
This project provides a self-administered dialogue engine which can help users to check the possibility of COVID-19 infection.
It serves as a virtual doctor and interacts with the users through 5-7 questions which consists of fever, respiratory symptoms, and epidemiological exposure history, etc. After the conversation, it provides with risk judgement and personlized medical advice.
You can modify the questions or answers, and configure logic according to the diagnostic guidelines for COVID-19 of your own country.

Supported platforms
---
Python 3.6+.

Basic Usage
---
```
# git clone project
$ git clone https://github.com/Tencent/TH_COVID19_International.git
$ cd TH_COVID19_International/src/servers/ncov-test-engine

# Install requirements
$ pip install -r requirements.txt

# Configure python path
$ export PYTHONPATH=server/

# Start engine
$ python3 server/service.py
```

Docker Usage
---
```
# git clone project
$ git clone https://github.com/Tencent/TH_COVID19_International.git
$ cd TH_COVID19_International/src/servers/ncov-test-engine

# Build docker image
$ docker build -t covid19-engine .

# Start docker covid19-engine
$ docker run --rm -it --name covid19-engine covid19-engine
```

Referenced guideline for this instrument
---
It is based on **Clinical Protocols for the Diagnosis and Treatment of COVID-19** ([link](https://covid19.21wecan.com/covid19en/c100021/202003/1000174.shtml)) published by **China National Health Commission**, and you can tweak the logic as appropriate.


Licensing
---
This project is licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) for the full license text.
