export const getApiBaseUrl = () => {
    if (__DEV__) {
        return "http://172.16.102.71:3000";
    }
    return "https://your-production-api.com";
};