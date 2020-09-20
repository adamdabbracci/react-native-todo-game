export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "https://9ce610ba815e.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}