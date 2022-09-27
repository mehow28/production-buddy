import { defineStore } from 'pinia';


export const useAuthStore = defineStore("auth",()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    async function userLogin(userInfo){
        const response = await fetch("https://localhost:7023/api/authentication/authenticate",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(userInfo)
        }).then(response=>response.json());
        console.log(response);
        
        this.user=response;
        localStorage.setItem("user",response);
    }
    const userLogout = () => {
        this.user.value=null;
        localStorage.removeItem("user");
    };
    return {user,userLogin,userLogout}
});