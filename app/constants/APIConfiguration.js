export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "http://92f7e4ae.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}