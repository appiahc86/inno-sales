import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000/";
// axios.defaults.headers.common['Authorization'] = "Bearer " +  token;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.patch['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.delete['Content-Type'] = 'application/json; charset=utf-8';




axios.interceptors.response.use(
    response => {
        return response;
    },
    async (error) => {
        if (error.response){
            if (error.response.status === 401){ //Not logged in
               // return  await router.push({ name: 'login' }); //do some here
            }
            else if (error.request.status === 0) //If server is down
                return ipcRenderer.send('errorMessage', "Sorry, server is down")

            else return ipcRenderer.send('errorMessage', error.response.data)
        }

         return Promise.reject(error);
    }
)


export default axios;


