# TH_COVID19_Universal

COVID-19 Live Updates of Tencent Health is developed to track the live updates of COVID-19, including the global pandemic trends, domestic live updates, and overseas live updates.


## Display
[Preview](https://covid-19.th.qq.com)

![Demo](./images/demo_2.png)


## Project structure

    TH_COVID19_International
    |-- src                       # Source code
    |   |-- db                    # Database import script
    |   |-- servers               # Source code of Backend
    |   |   |-- COVID-19-server                 # Main server
    |   |   |-- COVID-19-self-triage            # Self-administered triage engine
    |   |   |-- COVID-19-self-triage-server     # Self-administered triage server
    |   |-- web                   # Souce code of Frontend
    |
    |-- images                    # images of Display


## Instructions

### Database Deployment

1. `cd src/db/`
2. Import sql script under `src/db/` in mysql


### Backend Deployment

1. `cd src/servers/COVID-19-server`
2. `npm install`
3. Modify the configuration file under `/config/formal`, referring to the sample of  `/config/test`
4. Debug and execute `npm run dev` locally, will read the configuration file of `config/test`
5. Modify `start` command of `package.json` and configure `LOG_PATH`
6. Execute `npm run start` to run the program, will read the configuration files of `LOG_PATH` and `config/formal`

### Frontend Deployment

```bash
cd src/web
npm install
npm run dev

# Build for pre environment
npm run build:pre

# Build for production environment
npm run build
```

### Components

#### COVID-19 Self-triage:

It serves as a virtual doctor and interacts with the users through 5-7 questions which consists of fever, respiratory symptoms, and epidemiological exposure history, etc. After the conversation, it provides with risk judgement and personlized medical advice.
You can modify the questions or answers, and configure logic according to the
diagnostic guidelines for COVID-19 of your own country.

[COVID-19 Self-triage engine](src/servers/COVID-19-self-triage)
[COVID-19 self-triage server](src/servers/COVID-19-self-triage-server)
