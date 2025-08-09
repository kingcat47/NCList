export const getApiBaseUrl = () => {
    if (__DEV__) {
        return "http://172.30.1.79:3000";
    }
    return "https://your-production-api.com";
};