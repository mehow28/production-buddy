<script setup>
import {StreamBarcodeReader} from 'vue-barcode-reader';
import {modalController,alertController} from "@ionic/vue"
import MaszynaModal from "@/components/MaszynaModal.vue";
import { ref,defineEmits} from "vue";

const emit = defineEmits([
  "update:modelValue",
  "change",
])
const idMaszyny=ref("")
const updateIdMaszyny = ($event) => {
  idMaszyny.value = $event.target.value
    emit("update:idMaszyny", $event.target.value)
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

const onLoaded = () => {
  console.log("loaded")
}

const customAlert = async (alertType) => {
  let header =""
  if(alertType=="machineNotFound"){
    header="Nie znaleziono maszyny o podanym id. Proszę podać prawidłowe id maszyny."
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

const onDecode = (text) => {
  console.log("decoded");
  console.log(text);
  if(text.split(":")[0]=="idMaszyny"){
    fetch(`https://localhost:7023/api/maszyny/${text.split(":")[1]}`, {method:'GET',mode:'cors'}).then((response)=>{
      if(response.status===404||response.status===400){
        customAlert("machineNotFound")
      }
      else{
        openMaszynaModal(text.split(":")[1])
      }
    })
  }
  else{
    customAlert("wrongQrCode")
  }
}

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
      <ion-card>
        <ion-card-header style="text-align:center" >
          <ion-label><h2>Zeskanuj kod QR maszyny:</h2></ion-label>
        </ion-card-header>
        <ion-card-content>
          <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
        </ion-card-content>
        <ion-card-header style="text-align:center" >
          <ion-label><h2>Wpisz id maszyny:</h2></ion-label>
        </ion-card-header>
        <ion-card-content>
          
          <ion-list style="text-align:center" >
            <ion-input placeholder="#id" :value="idMaszyny" @input="updateIdMaszyny" @change="$emit('change',$event.target.value)"></ion-input>
            <ion-button expand="block" fill="clear" color="transparent" @click="onDecode(('idMaszyny:').concat(idMaszyny))">Wyszukaj po id</ion-button>
          </ion-list>
          
        </ion-card-content>
        
        
      </ion-card>
    
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard } from '@ionic/vue';


export default defineComponent({
  name: 'Tab2Page',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonCard }
});
</script>
