<script setup>
    
    import { useQuery } from "vue-query";
    import { fetchCall } from '../helpers/fetch-caller';
    import { defineProps, toRefs} from "vue";
    import {modalController} from "@ionic/vue"
    //const idStat = this.idStatusu; 
    const props = defineProps({
      idAwarii:Number,
    });
    const closeModal = () => {
        modalController.dismiss();
      };
      
    const {idAwarii} = toRefs(props)
    function getAwariaById() {
        return useQuery(["idAwarii"], ()=>fetchCall("awaria","get",null,idAwarii.value));
    }
    const {data: dataAwaria, isLoadingStatus:modalIsLoadingStatus, isErrorStatus:modalIsErrorStatus } = getAwariaById();

</script>

<template>
    
    <ion-header>
      <ion-toolbar>
        <span v-if="dataAwaria!=null">
          <ion-title>Awaria id:{{dataAwaria.idAwarii}}</ion-title>
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
      
      <ion-card>
        <ion-card-header>
          <ion-card-title style="text-align:center"><h3>Stanowisko: {{dataAwaria.maszyny[0].nazwa}}</h3></ion-card-title>
          <ion-card-subtitle style="text-align:center"><p>Marka: {{dataAwaria.maszyny[0].marka}}</p><p>Model: {{dataAwaria.maszyny[0].model}}</p></ion-card-subtitle>
          <ion-item>
            <ion-label v-if="dataAwaria.maszyny[0].dataPrzegladu!=null">Ostatni przegląd: {{dataAwaria.maszyny[0].dataPrzegladu}}</ion-label>
            <ion-label style="text-align:center" color="danger" v-else>BRAK PRZEGLĄDU</ion-label>
          </ion-item>
        </ion-card-header>
      </ion-card>

      <ion-card>
        <ion-card-content>  
          <ion-card-subtitle style="text-align:center">
            <h2>Data zgłoszenia: </h2>
            <p slot="end">{{dataAwaria.dataZgloszenia.split(".")[0].replace("T"," ").slice(0,-3).slice(2)}}</p>
          </ion-card-subtitle>
          <ion-item>
            <ion-label style="text-align: center;"><h1>Opis awarii:</h1></ion-label>
          </ion-item>
          <ion-item>
            <ion-textarea autoGrow="true" :value="dataAwaria.opis"></ion-textarea>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ng-container>
        <ion-list style="text-align:center" color="warning">
          <ion-button  fill="clear" color="warning" expand="block">huj</ion-button>

        </ion-list>
      </ng-container>
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
    IonCard
  } from "@ionic/vue";
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "AwariaViewModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton,IonCard },
  });
  </script>
  