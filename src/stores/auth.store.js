import { defineStore } from 'pinia';
import router from '../router/index';
import { fetchWrapper } from '../helpers/fetch-wrapper';
import jwtDecode from 'jwt-decode';
const baseUrl = 'https://localhost:7023/api/authentication';

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        returnUrl: null,
        authData: {
            token: "",
            tokenExp: "",
            idKonta: "",
            idPracownika: "",
          },
    }),
    actions: {
        async login(login, password) {
            const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { login:login, password:password });

            // update pinia state
            this.user = user;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            this.saveAuthToken(user);
            // redirect to previous url or default to home page
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
            this.authData = newAuthData;
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/login');
        }
    }
});