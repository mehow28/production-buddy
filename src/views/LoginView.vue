
<template>
<ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Production Buddy</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Log in</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">User Name</ion-label>
            <ion-input v-model="userInfo.login"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input type="password" v-model="userInfo.password"></ion-input>
          </ion-item>
          <ion-button expand="full" @click="login">Login</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
  </template>
  <script>
    import {
      IonContent,
      IonButton,
      IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
} from "@ionic/vue";
import {useAuthStore} from '../stores/auth.store'
export default {
  components: {
    IonContent,
    IonButton,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
  },
  data() {
    return {
      userInfo: {
        login: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      const authStore = useAuthStore()
      if (this.userInfo.login && this.userInfo.password) {
        return authStore
          .login(this.userInfo.login,this.userInfo.password)
          .catch(error=>console.error(error));
      }
    },
  },
};
</script>
