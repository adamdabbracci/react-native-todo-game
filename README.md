# React Native + Expo + AWS Amplify Example
An example of a React Natve TODO game with AWS Amplify. Built using the Expo client:
https://docs.expo.io

# Features
[X] Tasks
[~] Task scheduler (working, just needs some additonal testing and verification)
[] Advance task schedling (like start/end date)
[] Real-time user provisioning
[] Push notifications
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
1. Download nGrok and run `./ngrok http 80`
2. Update the app services file (APIConfiguration.js) to point to your pulic nGrok URL (i.e. http://e28721c126b9.ngrok.io)
3. Run `sls offline start --stage dev`

## API Functions
#### Run the task scheduler
 sls invoke local -f scheduleTodaysTasks