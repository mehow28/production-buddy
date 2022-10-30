<template>
    <ion-header>
      <ion-toolbar>
        <ion-title>machinemodal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      {{idMaszyny}} <br />
      <ion-button @click="closeModal">Close Modal</ion-button>
    </ion-content>
  </template>
  
  <script>
  import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    modalController,
  } from "@ionic/vue";
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "MachineModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton },
    props:{
        idMaszyny:String
    },
    setup() {
      const closeModal = () => {
        modalController.dismiss();
      };
  
      return { closeModal };
    },
  });
  </script>
  