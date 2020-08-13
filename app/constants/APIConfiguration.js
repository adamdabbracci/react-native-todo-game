export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "https://d1413dac4332.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}