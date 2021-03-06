# React Native + Expo + AWS Amplify Example
An example of a React Natve TODO game with AWS Amplify. Built using the Expo client:
https://docs.expo.io

# Features
[X] Tasks

[x] Task scheduler

[] Advance task schedling (like start/end date)

[] Improve task scheduler's handling of existing tasks

[] Real-time user provisioning

[x] Push notifications (setup in the app)

[] Push notifications on backend

[] "Parent" relationship to other accounts

[] Coin Store (including IAP)

[] Ticket rewards

[] Detailed account screen


## Install
`expo install` (in /app folder)
`npm install` (in /api folder)

## Run the app
`expo start` from within the `/app` directory

## Run the API locally
1. Download nGrok and run `./ngrok http 3000`
2. Update the app services file (APIConfiguration.js) to point to your pulic nGrok URL (i.e. http://e28721c126b9.ngrok.io)
3. Run `sls offline start --stage dev`

## API Functions
#### Run the task scheduler
 sls invoke local -f scheduleTodaysTasks
 #### Sync DB
 sls invoke local -f syncDatabase
