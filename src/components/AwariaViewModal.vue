<script setup>
    
    import { useQuery,useMutation } from "vue-query";
    import { fetchCall } from '../helpers/fetch-caller';
    import { defineProps, toRefs,ref,defineEmits} from "vue";
    import {modalController,alertController} from "@ionic/vue"
    

    //const idStat = this.idStatusu; 
    const props = defineProps({
      idAwarii:{
        type:Number,
        default:0
      }
    });
    const emit = defineEmits([
      "update:modelValue",
      "change",
    ])
    const opisAwarii=ref("")
    const updateOpisAwarii = ($event) => {
      opisAwarii.value = $event.target.value
        emit("update:opisAwarii", $event.target.value)
    }
    const closeModal = () => {
        modalController.dismiss();
      };
      
    const {idAwarii} = toRefs(props)
    function getAwariaById() {
        return useQuery(["idAwarii"], ()=>fetchCall("awaria","get",null,idAwarii.value));
    }
    function updateAwaria() {
        return useMutation((thisAwaria)=>fetchCall("awaria","put",thisAwaria,idAwarii.value));
    }

    function mutateAwaria(awaria,editOnly){
      console.log(awaria.stan)
      if(editOnly){
        awariaMutate({
          stan:awaria.stan,
          dataZgloszenia:awaria.dataZgloszenia,
          opis:opisAwarii.value,
      })}
      else{
        awariaMutate({
          stan:false,
          dataZgloszenia:awaria.dataZgloszenia,
          opis:opisAwarii.value,
      })}
    }

    const awariaAlert = async (dataAwaria,isEdit) => {
      const alert=await alertController.create({
          header:'Edytować wpis o awarii?',
          buttons:[
          {
              text: 'Wróć',
              role: 'cancel',
              handler: () => {
                  },
          },
          {
              text: 'Potwierdź',
              role: 'confirm',
              handler: () => {
                mutateAwaria(dataAwaria,isEdit)
              },
          },
          ]
      })
      await alert.present();
    };
    const {data: dataAwaria, isLoadingStatus:modalIsLoadingStatus, isErrorStatus:modalIsErrorStatus } = getAwariaById();
    const {mutate:awariaMutate}= updateAwaria();
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
      <div v-if="dataAwaria">  
        <ion-card style="padding:0px;margin:0px">
          <ion-card-header style="padding:0px;margin:0px">
            <ion-card-title style="text-align:center"><h3>Stanowisko: {{dataAwaria.maszyny[0].nazwa}}</h3></ion-card-title>
            <ion-card-subtitle style="text-align:center"><p>Marka: {{dataAwaria.maszyny[0].marka}}</p><p>Model: {{dataAwaria.maszyny[0].model}}</p></ion-card-subtitle>
            <ion-item>
              <ion-label v-if="dataAwaria.maszyny[0].dataPrzegladu!=null">Ostatni przegląd: {{dataAwaria.maszyny[0].dataPrzegladu.split(".")[0].replace("T"," ").slice(0,-3).slice(2)}}</ion-label>
              <ion-label style="text-align:center" color="danger" v-else>BRAK PRZEGLĄDU</ion-label>
            </ion-item>
          </ion-card-header>
        </ion-card>

        <ion-card style="padding:0px;margin:0px">
          <ion-card-content style="padding:0px;margin:0px">  
            <ion-card-subtitle style="text-align:center">
              <h2>Data zgłoszenia: </h2>
              <p>{{dataAwaria.dataZgloszenia.split(".")[0].replace("T"," ").slice(0,-3).slice(2)}}</p>
            </ion-card-subtitle>
            <ion-item>
              <ion-label style="text-align: center;"><h1>Opis awarii:</h1></ion-label>
            </ion-item>
            <ion-item>
              <ion-textarea style="text-align: center;" autoGrow="true" :placeholder="dataAwaria.opis" :value="opisAwarii" @input="updateOpisAwarii" @change="$emit('change',$event.target.value)"></ion-textarea>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card style="padding:5px;margin:0px">
          <ion-list style="text-align:center;padding:0px;margin:0px" color="warning">
            <ion-button  fill="clear" color="warning" expand="block" @click="awariaAlert(dataAwaria,true)">edytuj opis</ion-button>
          </ion-list>
        </ion-card>

        
        <ion-card style="padding:5px;margin:0px">
          <ion-list style="text-align:center;padding:0px;margin:0px" color="warning">
            <ion-button  fill="clear" color="success" expand="block" @click="awariaAlert(dataAwaria,false)">usuń awarię i edytuj opis</ion-button>
          </ion-list>
        </ion-card>
      </div>
    </span>

    </ion-content>
  </template>
  
  <script>
  import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonButtons, IonSkeletonText, IonListHeader, IonThumbnail, IonLabel, IonItem, IonList, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, IonCardSubtitle, IonTextarea, 
  } from "@ionic/vue";
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "AwariaViewModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton,IonCard, IonButtons, IonSkeletonText, IonListHeader, IonThumbnail, IonLabel, IonItem, IonList, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, IonCardSubtitle, IonTextarea,  },
  });
  </script>
  