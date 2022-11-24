<script setup>
  import { useQuery, useMutation } from "vue-query";
  import { fetchCall } from '../helpers/fetch-caller';
  import { ref,defineEmits } from 'vue';

  const idPracownika = JSON.parse(localStorage.getItem('user')).idPracownika;
  const accessRights = JSON.parse(localStorage.getItem('user')).access;

  function getPracownik() {
    return useQuery("idPracownika", ()=>fetchCall("pracownicy","get",null,idPracownika));
  }
  function updatePracownik() {
    return useMutation((thisPracownik)=>fetchCall("pracownicy","put",thisPracownik,idPracownika))
  }
  const emit = defineEmits([
      "update:modelValue",
      "change",
    ])

  const emailValue=ref("")
  const phoneNoValue=ref("")

  const updateEmailValue = ($event) => {
    emailValue.value = $event.target.value
      emit("update:emailValue", $event.target.value)
  }
  const updatePhoneNoValue = ($event) => {
    phoneNoValue.value = $event.target.value
      emit("update:phoneNoValue", $event.target.value)
  }

  function mutatePracownik(data, mode){
    if(mode=="mail"){
      mutate({
        imie:data.imie,
        nazwisko:data.nazwisko,
        email:emailValue.value,
        nrtel:data.nrtel
      });
    }
    if(mode=="phone"){
      mutate({
        imie:data.imie,
        nazwisko:data.nazwisko,
        email:data.email,
        nrtel:phoneNoValue.value
      });
    }
  }
  
  function countAssignedTasks(data){
    let zlecenieCount = 0;
    let etapyCount = 0;
    let finishedEtapyCount = 0;
    data.forEach(zlecenie=>{
      zlecenieCount=zlecenieCount+1;
      zlecenie.statuses.forEach(status=>{
        etapyCount=etapyCount+1;
        if(status.stan){
          finishedEtapyCount=finishedEtapyCount+1;
        }
      })
    })
    return {
      zlecenieCount:zlecenieCount,
      etapyCount:etapyCount,
      finishedEtapyCount:finishedEtapyCount}
  }

  function getZleceniaByPracownikQuery() {
    return useQuery("idZlecenia", ()=>fetchCall("ZleceniaPracownika","get",null,idPracownika));
  }

  const {data: dataZlecenia} = getZleceniaByPracownikQuery();
  const {data, isLoadingStatus, isErrorStatus} = getPracownik();
  const {mutate} = updatePracownik();
  
</script>


<template>
  <ion-page>
    <top-toolbar pageName="Profil"/>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="reloadPage">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
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
        <div v-if="data">
          <ion-item style="padding:10px;padding-bottom:5px">  
              <ion-thumbnail slot="end">
                <img src="https://st3.depositphotos.com/1518767/12738/i/950/depositphotos_127381860-stock-photo-happy-female-warehouse-worker.jpg"/>
              </ion-thumbnail> 
              <ion-label><h2>{{data.imie}} {{data.nazwisko}}</h2><p>Imię i nazwisko</p></ion-label>
          </ion-item>
          <ion-item style="padding:10px;padding-top:0px;padding-bottom:5px">  
            <ion-icon slot="end" :icon="checkmarkOutline" v-if="mailCheck" @click="mutatePracownik(data,'mail');mailCheck=!mailCheck"/> <ion-icon slot="end" :icon="createOutline" v-on:click="mailCheck=!mailCheck"/>
            <ion-label><ion-input :placeholder="data.email" :value="emailValue" @input="updateEmailValue" @change="emit('change',$event.target.value)" v-if="mailCheck" /><h2 v-if="!mailCheck">{{data.email}}</h2><p>Adres e-mail</p></ion-label>
          </ion-item>
          <ion-item style="padding:10px;padding-top:0px;">  
            <ion-icon slot="end" :icon="checkmarkOutline" v-if="phoneCheck" @click="mutatePracownik(data,'phone');phoneCheck=!phoneCheck"/> <ion-icon slot="end" :icon="createOutline" v-on:click="phoneCheck=!phoneCheck"/> 
            <ion-label><ion-input :placeholder="data.nrtel" :value="phoneNoValue" @input="updatePhoneNoValue" @change="emit('change',$event.target.value)" v-if="phoneCheck" /><h2 v-if="!phoneCheck">{{data.nrtel}}</h2><p>Nr telefonu</p></ion-label>
          </ion-item>
        </div>
        <div v-if="dataZlecenia">
          <ion-item style="padding:10px;padding-bottom:5px">
            <ion-label><h1>{{countAssignedTasks(dataZlecenia).zlecenieCount}}</h1><p>Liczba przypisanych zleceń</p></ion-label>
          </ion-item>
          <ion-item style="padding:10px;padding-top:0px">
            <ion-label><h1>{{countAssignedTasks(dataZlecenia).finishedEtapyCount}}/{{countAssignedTasks(dataZlecenia).etapyCount}}</h1><p>Ukończone / Wszystkie przypisane etapy</p></ion-label>
          </ion-item>
        </div>
      </span>

    </ion-content>

    <div v-if="accessRights=='wszystkie'" style="margin-left:auto;margin-right:10px;margin-bottom:10px">
      <ion-fab-button size="medium" style="border-radius:50px" @click="openStatusAddModal"><ion-icon :icon="add"/></ion-fab-button>
    </div>

  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { modalController, IonPage, IonFabButton, IonContent, IonSkeletonText, IonListHeader, IonThumbnail, IonLabel, IonItem, IonList, IonCard, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, IonInput, IonRefresher, IonRefresherContent } from '@ionic/vue';
import {createOutline, checkmarkOutline, add} from 'ionicons/icons'
import StatusAddModal from "@/components/StatusAddModal.vue"

export default defineComponent({
  name: 'Tab3Page',
  components: {  IonContent,IonFabButton, IonPage, IonSkeletonText, IonListHeader, IonThumbnail, IonLabel, IonItem, IonList, IonCard, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, IonInput, IonRefresher, IonRefresherContent},
  methods:{
    reloadPage() {
      window.location.reload();
    },
    async openStatusAddModal(){
        const modal = await modalController.create({
          component: StatusAddModal
        });
        return modal.present();
      },
  },
  data(){
    return{
      mailCheck:false,
      phoneCheck:false
    }
  },
});
</script>

<style>
  ion-thumbnail {
    --border-radius: 50px;
  }
</style>