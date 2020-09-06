export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "http://6d7535b022fa.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}