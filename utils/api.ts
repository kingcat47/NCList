export const getApiBaseUrl = () => {
    if (__DEV__) {
        return "http://192.168.1.5:3000";
    }
    return "https://your-production-api.com";
};