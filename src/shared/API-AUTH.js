import axios from 'axios';
let token;

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

// async function getNewAccessToken(token, refresh_token) {
// 	return axios.post(
// 		process.env.REACT_APP_API_URL + '/token/regen',
// 		{
// 			token: token,
// 		},
		
// 	);
// }

// const savetoken = async ({ token }) => {
// 	try {
// 		localStorage.setItem('token', token);
// 	} catch (e) {
// 		console.error('Token Error: ', e);
// 	}
// };

// Add a request interceptor
instance.interceptors.request.use(
	(config) => {
		let local_store_token = sessionStorage.getItem('token');
		if (local_store_token && typeof local_store_token != undefined && local_store_token != '') {
			token = local_store_token;
		}

		config.headers['Authorization'] = `Bearer ${token}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Updated response interceptor
instance.interceptors.response.use(
	(response)=>{
		return response;
	},
	async(error) => {
		if(error.response && error.response.status === 401) {
			//window.location.href = '/';
			return Promise.reject(error.response);
		}else{
			return Promise.reject(error.response);
		}
	}
)


export default instance;
