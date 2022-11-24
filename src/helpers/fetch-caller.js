import { alertController } from '@ionic/vue';
import { fetchWrapper} from './fetch-wrapper';

const baseUrl = 'https://localhost:7023/api';

const fetchGetAll = async(url) => await fetchWrapper.get(url);
const fetchGetOne = async(url) => await fetchWrapper.get(url);
const fetchDelete = async(url) => await fetchWrapper.delete(url);
const fetchPost = async(url, body) => await fetchWrapper.post(url, body);
const fetchUpdate = async(url, body) => await fetchWrapper.put(url, body);

export const fetchCall = async (
    controller ="",
    method = "",
    body = null,
    id = null
)=>{
    switch(method){
        case "get":{
            if(id){
                return fetchGetOne(`${baseUrl}/${controller}/${id}`);
            }
            return fetchGetAll(`${baseUrl}/${controller}`,body);
        }
        case "post":{
            if(id){
                return fetchPost(`${baseUrl}/${controller}/${id}`,body);
            }
            return fetchPost(`${baseUrl}/${controller}`,body);
        }
        case "delete":{
            return fetchDelete(`${baseUrl}/${controller}/${id}`)
        }
        case "put":{
            return fetchUpdate(`${baseUrl}/${controller}/${id}`,body)
        }
        default: {
            const alert = await alertController.create({
                header:'Error while attempting fetchCall',
                buttons:[
                    {
                        text:'Ok',
                        role:'confirm',
                        handler:()=>{}
                    }
                ]
            })
            await alert.present();
        }
    }
}