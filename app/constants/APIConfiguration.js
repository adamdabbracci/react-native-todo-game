export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "https://9ce610ba815e.ngrok.io";
        }
        else {
            return "https://8fwa5km7wf.execute-api.us-east-1.amazonaws.com";
        }
    }
}