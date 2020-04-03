# COVID-19 Self-Triage Server

Method
1. run `npm install`
2. Modify the configuration file `router` under `/config/formal`, Set the engine_addr field to the [self-triage engine service](src/servers/COVID-19-self-triage) address such as localhost:50051
3. Debug and execute `npm run dev` locally, will read the configuration file of `config/local`
4. Modify `start` command of `package.json` and configure `LOG_PATH`
5. Execute `npm run start` to run the program, will read the configuration files of `LOG_PATH` and `config/formal`


