<template>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{pageName}}</ion-title>
        <ion-button slot="end" @click="logoutAlert" style="padding-right:10px" fill="clear" color="danger">Wyloguj się</ion-button>
      </ion-toolbar>
    </ion-header>
  </template>
  
  <script >
    import { defineComponent } from 'vue';
    import { IonHeader, IonToolbar, IonTitle,IonButton } from '@ionic/vue';
    import {useAuthStore} from '../stores/auth.store'
    import { alertController } from '@ionic/core';
    export default defineComponent({
      components: { IonHeader, IonToolbar, IonTitle,IonButton },
      props:["pageName"],
      setup(){
        const authStore = useAuthStore();
        const logoutAlert = async () => {
            const alert = await alertController.create({
                message:'Czy na pewno chcesz się wylogować?',
                buttons:[
                {
                    text: 'Anuluj',
                    role: 'cancel',
                    handler: () => {
                        },
                },
                {
                    text: 'OK',
                    role: 'confirm',
                    handler: () => {
                        authStore.logout();
                    },
                },
                ]
            })
            await alert.present();
        };
        return{logoutAlert}
      },
    });
  </script>