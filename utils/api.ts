export const getApiBaseUrl = () => {
    if (__DEV__) {
        return "http://172.30.1.78:3000";
    }
    return "https://your-production-api.com";
};