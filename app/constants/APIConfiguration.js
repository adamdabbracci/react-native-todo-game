import { proc } from "react-native-reanimated";

export class APIConfiguration {
    getApiHost = () => {
        let host = "https://8fwa5km7wf.execute-api.us-east-1.amazonaws.com/dev" // fallback

        // running in Expo
        if (__DEV__) {
            host = "https://85c4711671f7.ngrok.io";
        }

        if (process.env.API_HOST) {
            console.log("Found API URL in the SSM parameter in env vars: " + process.env.API_HOST)
            host = process.env.API_HOST
        }
        
        console.log(`API HOST: ${host}`)
        return host
    }
}