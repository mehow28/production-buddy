<script setup>
import {StreamBarcodeReader} from 'vue-barcode-reader';
import {modalController,alertController} from "@ionic/vue"
import MaszynaModal from "@/components/MaszynaModal.vue";
import { ref,defineExpose,defineEmits} from "vue";
import { fetchCall } from '../helpers/fetch-caller';
import { useMutation } from "vue-query";

const idMaszyny=ref("")
const idStatusu=ref("")
const modeChoice=ref("etap")
const emit = defineEmits([
      "update:modeChoice",
      "change",
]);
const updateModeChoice = ($event) => {
  modeChoice.value = $event.target.value 
  emit("update:modeChoice", $event.target.value)
}
async function openMaszynaModal(passedMaszyna){
  const modal = await modalController.create({
    component: MaszynaModal, 
    componentProps:{
      idMaszyny:passedMaszyna
    }
  });
  return modal.present();
}

const customAlert = async (alertType) => {
  let header =""
  if(alertType=="machineNotFound"){
    header="Nie znaleziono maszyny o podanym id. Proszę podać prawidłowe id maszyny."
  }
  else if(alertType=="statusNotFound"){
    header="Nie znaleziono statusu o podanym id. Proszę podać prawidłowe id statusu."
  }
  else if(alertType=="wrongQrCode"){
    header="Zeskanowano nieprawidłowy kod QR. Proszę zeskanować prawidłowy kod lub podać id maszyny."
  }
  const alert=await alertController.create({
      header:header,
      buttons:[
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
              },
        },
      ]
  })
  await alert.present();
};
const confirmStatusUpdateAlert = async (responsePromise) => {
  
  const alert=await alertController.create({
      header:'Czy zmienić stan etapu na zakończony?',
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
            responsePromise.then((response)=>{
              mutate({
              stan:true,
              idZlecenia:response.idZlecenia,
              idPracownika:response.idPracownika,
              idEtapu:response.idEtapu,
              idMaszyny:response.idMaszyny,
              czasTrwania:response.czasTrwania,
              notatki:response.notatki
            })
            })
           
          },
        },
      ]
  })
  await alert.present();
};

const onDecode = async (text) => {
  if(text.split(":")[0]=="idMaszyny"&&parseInt(text.split(":")[1])>0){
    await fetch(`https://localhost:7023/api/maszyny/${text.split(":")[1]}`, {method:'GET',mode:'cors'}).then((response)=>{
      if(response.status===404||response.status===400){
        customAlert("machineNotFound")
      }
      else{
        openMaszynaModal(text.split(":")[1])
      }
    })
  }
  else if(text.split(":")[0]=="idStatusu"&&parseInt(text.split(":")[1])>0){
    fetch(`https://localhost:7023/api/status/${text.split(":")[1]}`, {method:'GET',mode:'cors'}).then((response)=>{
      if(response.status===404||response.status===400){
        customAlert("statusNotFound")
      }
      else{
        confirmStatusUpdateAlert(handleResponse(response))
      }
    })
  }
  else{
    customAlert("wrongQrCode")
  }
}


function updateStatus() {
  return useMutation((thisStatus)=>fetchCall("status","put",thisStatus,idStatusu.value));
}
const {mutate} = updateStatus()

const handleResponse = (response) => {
  return response.text().then((text) => {
    return JSON.parse(text);
  })
};

defineExpose({
  modeChoice,
  idMaszyny,
  idStatusu
})
</script>

<template>
  <ion-page>
    <top-toolbar pageName="Skaner"/>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Skaner</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-segment v-model="modeChoice">
        <ion-segment-button value="etap"  @click="updateModeChoice">
          <ion-label>Ukończ etap</ion-label>
        </ion-segment-button>
        <ion-segment-button value="maszyna" @click="updateModeChoice">
          <ion-label>Sprawdź maszynę</ion-label>
        </ion-segment-button>
      </ion-segment>
  
      
      <ion-card>
        <ion-card-header style="text-align:center" >
          <ion-label><h2 v-if="modeChoice=='maszyna'">Zeskanuj kod QR maszyny:</h2><h2 v-else>Zeskanuj kod QR statusu:</h2></ion-label>
        </ion-card-header>
        <ion-card-content>
          <StreamBarcodeReader @decode="onDecode"></StreamBarcodeReader>
        </ion-card-content>
        <ion-card-header style="text-align:center" >
          <ion-label><h2 v-if="modeChoice=='maszyna'">Wpisz id maszyny:</h2><h2 v-else>Wpisz id statusu:</h2></ion-label>
        </ion-card-header>
        <ion-card-content>
          
          <ion-list v-if="modeChoice=='maszyna'" style="text-align:center" >
            <ion-input placeholder="#id" v-model="idMaszyny"></ion-input>
            <ion-button expand="block" fill="clear" color="transparent" @click="onDecode(('idMaszyny:').concat(idMaszyny))">Wyszukaj po id</ion-button>
          </ion-list>
          <ion-list v-else style="text-align:center" >
            <ion-input placeholder="#id" v-model="idStatusu"></ion-input>
            <ion-button expand="block" fill="clear" color="transparent" @click="onDecode(('idStatusu:').concat(idStatusu))">Wyszukaj po id</ion-button>
          </ion-list>
          
        </ion-card-content>
        
        
      </ion-card>
    
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonLabel, 
  IonCardHeader, IonCardContent, IonInput, IonButton, IonList, IonSegment, IonSegmentButton  
} from '@ionic/vue';


export default defineComponent({
  name: 'Tab2Page',
  components: { 
    IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonCard, IonLabel, 
    IonCardHeader, IonCardContent, IonInput, IonButton, IonList, IonSegment, IonSegmentButton
  }
});
</script>
