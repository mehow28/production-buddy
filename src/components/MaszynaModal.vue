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
      <ion-list style="text-align:center">
        <ion-button v-if="dataMaszyna.idAwarii==null || dataMaszyna.idAwarii<1" expand="block" fill="clear" color="transparent" @click="openAwariaAddModal(dataMaszyna.idMaszyny)">ZGŁOŚ AWARIĘ MASZYNY</ion-button>
        <ion-button v-else expand="block" fill="clear" color="danger" @click="openAwariaViewModal(dataMaszyna.idAwarii)">AWARIA MASZYNY</ion-button>
      </ion-list>
    </ion-card>
    
    <ion-card>
      <ion-accordion-group>
        <ion-accordion value="first">
          <ion-item slot="header" color="light" style="text-align: center;">
            <ion-label>Przypisane etapy</ion-label>
          </ion-item>
          <div slot="content" style="padding:5px; text-align: center;" @click="openStatusModal(status.idStatusu)" v-for="status in dataMaszyna.statuses" :key="status.idEtapu">
            <ion-label color="dark"><h2>{{status.idEtapuNavigation.nazwa}}</h2>//zlec.{{status.idZlecenia}}</ion-label>
          </div>
        </ion-accordion>
      </ion-accordion-group>
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
  import AwariaViewModal from "@/components/AwariaViewModal.vue";
  import AwariaAddModal from "@/components/AwariaAddModal.vue";
  import StatusModal from "@/components/StatusModal.vue";


  export default defineComponent({
    name: "MaszynaModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton },
    methods:{
      async openAwariaViewModal(passedAwaria){
        const modal = await modalController.create({
          component: AwariaViewModal, 
          componentProps:{
            idAwarii:passedAwaria
          }
        });
        return modal.present();
      },
      async openAwariaAddModal(passedMaszynaForAwaria){
        const modal = await modalController.create({
          component: AwariaAddModal, 
          componentProps:{
            idMaszyny:passedMaszynaForAwaria
          }
        });
        return modal.present();
      },
      async openStatusModal(passedVal){
      const modal = await modalController.create({
        component: StatusModal, 
        componentProps:{
          idStatusu:passedVal
        }
      });
      return modal.present();
    },
    }
  });
  </script>
  