export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "http://67c2c99bdd9e.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}