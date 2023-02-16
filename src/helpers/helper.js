import axios from 'axios';
export const BASE_URL = 'https://scm.acolabz.com/backend/api/';
const scm_user=sessionStorage.getItem("scm_user")
export function axiosClient() {
    let defaultOptions = {
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            accept: 'application/json',
        },
    };
    let instance = axios.create(defaultOptions);
    instance.interceptors.request.use(function (config) {
        config.headers.common = {
            Authorization: `Bearer ${scm_user.token}`,
        };
        return config;
    });
    return instance;
}
export default axiosClient;
