<script setup>
  
  import { useQuery } from "vue-query";
  import { fetchCall } from '../helpers/fetch-caller';
  const idPracownika = JSON.parse(localStorage.getItem('user')).idPracownika;

  function getZleceniaByPracownikQuery() {
    return useQuery("idZlecenia", ()=>fetchCall("ZleceniaPracownika","get",null,idPracownika));
  }
  const {data: dataZlecenia, isLoadingStatus, isErrorStatus} = getZleceniaByPracownikQuery();

</script>

<template>  

  <ion-page>
    <top-toolbar pageName="Zlecenia"/>
      <ion-content :fullscreen="true">
       
        <span v-if="isLoadingStatus">
          <ion-card>          
            <ion-list>
              <ion-list-header>
                <ion-skeleton-text [animated]="true" style="width: 80px"></ion-skeleton-text>
              </ion-list-header>
              <ion-item>
                <ion-thumbnail slot="start">
                  <ion-skeleton-text [animated]="true"></ion-skeleton-text>
                </ion-thumbnail>
                <ion-label>
                  <h3>
                    <ion-skeleton-text [animated]="true" style="width: 80%;"></ion-skeleton-text>
                  </h3>
                  <p>
                    <ion-skeleton-text [animated]="true" style="width: 60%;"></ion-skeleton-text>
                  </p>
                  <p>
                    <ion-skeleton-text [animated]="true" style="width: 30%;"></ion-skeleton-text>
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card>
        </span>
       
        <span v-else-if="isErrorStatus">
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
          <ion-card v-for="zlecenie in dataZlecenia" :key="zlecenie.idZlecenia">
            <ion-card-header>
              <ion-card-title>
                Zlecenie #{{zlecenie.idZlecenia}} - "{{zlecenie.idProduktuNavigation.nazwa}}"
                <ion-card-subtitle>Data rozpoczęcia: {{zlecenie.dataRozpoczecia.split(".")[0].replace("T"," ").slice(0,-3).slice(2)}}</ion-card-subtitle>
                <ion-card-subtitle v-if="zlecenie.dataZakonczenia!=null">Data zakończenia: {{zlecenie.dataZakonczenia.split(".")[0].replace("T"," ").slice(0,-3).slice(2)}}</ion-card-subtitle>
              </ion-card-title>
            </ion-card-header>

            <ion-item v-for="status in zlecenie.statuses" :key="status.idStatusu">
              <ion-label class="ion-text-wrap">
                <h2>{{status.idEtapuNavigation.nazwa}}</h2>
                <p>{{status.idEtapuNavigation.opis}}</p>
              </ion-label>
              <ion-item v-if="status.stan">
                <ion-icon :icon="checkmarkCircleOutline" color="success"/>
              </ion-item>
              <ion-item style="padding-right:-10px" v-else>
                <ion-icon :icon="closeCircleOutline" color="warning"/>
                <ion-button fill="outline"  @click="openStatusModal(status.idStatusu)" >Zobacz</ion-button>
              </ion-item>

            </ion-item>
            
            <ion-card-content>
              <p>{{zlecenie.opis}}</p>
            </ion-card-content>
          
          </ion-card>
        </span>
    </ion-content>
  </ion-page>

</template>

<script>
import { defineComponent } from 'vue';
import { IonPage,  IonContent,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, modalController  } from '@ionic/vue';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import StatusModal from "@/components/StatusModal.vue";
export default  defineComponent({
  name: 'Tab1Page',
  components: {  IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem  },
  methods: {
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