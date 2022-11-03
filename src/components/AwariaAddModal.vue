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
    console.log(idMaszyny)
    function getMaszynaById() {
        return useQuery(["idMaszyny"], ()=>fetchCall("maszyny","get",null,idMaszyny.value));
    }
    const {data: dataMaszyna, isLoadingStatus:modalIsLoadingStatus, isErrorStatus:modalIsErrorStatus } = getMaszynaById();

</script>

<template>
    
    <ion-header>
      <ion-toolbar>
        <ion-title>Zgłaszanie awarii</ion-title>
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

      <ion-card>
      <ion-list lines="full">
        <ion-item>
          <ion-label><p>Kategoria: {{dataMaszyna.kategoria}}</p></ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Marka: {{dataMaszyna.marka}}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Model: {{dataMaszyna.model}}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label v-if="dataMaszyna.dataPrzegladu!=null">Ostatni przegląd: {{dataAwaria.maszyny[0].dataPrzegladu}}</ion-label>
          <ion-label color="danger" v-else>Ostatni przegląd: BRAK PRZEGLĄDU</ion-label>
        </ion-item>
      </ion-list>    
    </ion-card>

    <ion-card>
      <ion-item>
          <ion-textarea autoGrow="true" :value="dataAwaria.opis"></ion-textarea>
      </ion-item>
    </ion-card>

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
    name: "AwariaAddModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton },
  });
  </script>
  