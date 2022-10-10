import { defineStore } from 'pinia';
import router from '../router/index';
import jwtDecode from 'jwt-decode';
import { fetchCall } from '../helpers/fetch-caller';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null,
    }),
    actions: {
        async login(login, password) {
            const user = await fetchCall("authentication/authenticate","post",{login:login, password:password});
            this.user = user;
            const userInfo = this.saveAuthToken(user);
            localStorage.setItem('user', JSON.stringify(userInfo));
            router.push(this.returnUrl || '/');
        },
        saveAuthToken(payload){
            const jwtDecodeUserInfo = jwtDecode(payload);
            const newAuthData = {
                token: payload,
                tokenExp: jwtDecodeUserInfo.exp,
                idKonta: jwtDecodeUserInfo.sub,
                idPracownika: jwtDecodeUserInfo.name,
            };
            return newAuthData;
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/login');
        }
    }
});