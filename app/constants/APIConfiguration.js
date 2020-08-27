export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "https://c3809cc1440b.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}