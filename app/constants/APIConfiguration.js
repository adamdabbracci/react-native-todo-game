export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "https://89d487d6ee42.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}