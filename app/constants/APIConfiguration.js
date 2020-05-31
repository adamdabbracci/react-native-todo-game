export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "http://aed6bb6b72f0.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}