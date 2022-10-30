<script setup>
    
    import { useQuery } from "vue-query";
    import { fetchCall } from '../helpers/fetch-caller';
    import { defineProps, toRefs} from "vue";
    import {modalController} from "@ionic/vue"
    //const idStat = this.idStatusu; 
    const props = defineProps({
      idMaszyny:Number,
    });
    const closeModal = () => {
        modalController.dismiss();
      };
      
    const {idMaszyny} = toRefs(props)
    function getMaszynaById() {
        return useQuery(["idMaszyny"], ()=>fetchCall("maszyny","get",null,idMaszyny.value));
    }
    const {data: dataMaszyna, isLoadingStatus:modalIsLoadingStatus, isErrorStatus:modalIsErrorStatus } = getMaszynaById();

</script>

<template>
    
    <ion-header>
      <ion-toolbar>
        <span v-if="dataMaszyna!=null">
          <ion-title>Maszyna: {{dataMaszyna.nazwa}}</ion-title>
        </span>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">WYJDŹ</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      
      <span v-if="modalIsLoadingStatus">
      <ion-card>
        <ion-card-header>
          <ion-card-title><ion-icon name="refresh-outline"/>Loading...</ion-card-title>
        </ion-card-header>
      </ion-card>
    </span>
  
    <span v-else-if="modalIsErrorStatus">
      <ion-card color="warning">
        <ion-card-header>
          <ion-card-title><ion-icon name="bug-outline"/>Oh no!</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          {{ errorStatus.message }}
        </ion-card-content>
      </ion-card>
    </span>

    <span v-else>
      {{dataMaszyna}}
    </span>

    </ion-content>
  </template>
  
  <script>
  import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
  } from "@ionic/vue";
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "MaszynaModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton },
  });
  </script>
  