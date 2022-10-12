<script setup>

  import { useQuery } from "vue-query";
  import { fetchCall } from '../helpers/fetch-caller';
  const idPracownika = JSON.parse(localStorage.getItem('user')).idPracownika;

  function getStatusesQuery() {
    return useQuery("idStatusu", ()=>fetchCall("status","get",`idPracownika=${JSON.stringify(idPracownika)}`));
  }
  function getZleceniaQuery() {
    return useQuery("idZlecenia", ()=>fetchCall("zlecenium","get"));
  }
  function getEtapyQuery() {
    return useQuery("idEtapu", ()=>fetchCall("etapy","get"));
  }
  
  const { isLoading:isLoadingStatus , isError:isErrorStatus, error:errorStatus, data:dataStatus} = getStatusesQuery();
  const { data:dataZlecenia } = getZleceniaQuery();
  const {data:dataEtap } = getEtapyQuery();
  
</script>

<template>  
  <ion-page>
    <top-toolbar pageName="Tab 1"/>
      <ion-content :fullscreen="true">
       
        <span v-if="isLoadingStatus">
          <ion-card>
            <ion-card-header>
              <ion-card-title><ion-icon name="refresh-outline"/>Loading...</ion-card-title>
            </ion-card-header>
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
              Zlecenie #{{zlecenie.idZlecenia}}
              <ion-card-subtitle>Data rozpoczęcia: {{zlecenie.dataRozpoczecia.replace('T',' ')}}</ion-card-subtitle>
              <ion-card-subtitle v-if="zlecenie.dataZakonczenia!=null">Data zakończenia: {{zlecenie.dataZakonczenia.replace('T',' ')}}</ion-card-subtitle>
            </ion-card-title>
          </ion-card-header>

          <span v-for="status in dataStatus" :key="status.idStatusu">
            <span v-if="status.stan">
            <ion-item v-if="status.idZlecenia==zlecenie.idZlecenia">
                <ion-icon :icon="checkmarkCircleOutline" slot="end" color="success"></ion-icon>
                <span v-for="etap in dataEtap" :key="etap.idEtapu">
                  <ion-label v-if="etap.idEtapu==status.idEtapu">{{etap.nazwa}}</ion-label>
                </span>
                <ion-button fill="outline" slot="end" @click="viewMore=!viewMore">View</ion-button>
              </ion-item>
            </span>
            
            <span v-else>
            <ion-item  v-if="status.idZlecenia==zlecenie.idZlecenia">
              <ion-icon :icon="closeCircleOutline" slot="end" color="danger"/>
                <span v-for="etap in dataEtap" :key="etap.idEtapu">
                  <ion-label v-if="etap.idEtapu==status.idEtapu">{{etap.nazwa}}</ion-label>
                </span>
                <ion-button fill="outline" slot="end">View</ion-button>
              </ion-item>
            </span>
          </span>
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
import { IonPage,  IonContent,IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonLabel  } from '@ionic/vue';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
//import ExploreContainer from '@/components/ExploreContainer.vue';

export default  defineComponent({
  name: 'Tab1Page',
  components: {  IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonLabel  },
});
</script>

//imp IonHeader, IonToolbar, IonTitle,
//imp ExploreContainer, IonHeader, IonToolbar, IonTitle,

<!-- 
<ion-header collapse="condense">
  <ion-toolbar>
    <ion-title size="large">Tab 1</ion-title>
  </ion-toolbar>
</ion-header>

<ExploreContainer name="Tab 1 page" /> -->