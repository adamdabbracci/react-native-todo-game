export class APIConfiguration {
    getApiHost = () => {
        if (__DEV__) {
            return "https://9a0f5b61464d.ngrok.io";
        }
        else {
            return "https://prod.myap.com";
        }
    }
}