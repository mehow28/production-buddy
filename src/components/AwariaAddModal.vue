<script setup>    
    import { useMutation, useQuery } from "vue-query";
    import { fetchCall } from '../helpers/fetch-caller';
    import { defineProps, toRefs,defineEmits,ref} from "vue";
    import {modalController} from "@ionic/vue"
    import { alertController } from '@ionic/core';
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
    //const idStat = this.idStatusu; 
    const closeModal = () => {
      modalController.dismiss();
    };
    const emit = defineEmits([
      "update:modelValue",
      "change",
    ])
    const modelValue = ref("")
    const props = defineProps({
      idMaszyny:{
        type:Number,
        default:0
      }
    });
    const {idMaszyny} = toRefs(props)
    console.log("idMaszyny: "+idMaszyny)
    //const machineData = ref();
    const updateModelValue = ($event) => {
        modelValue.value = $event.target.value
        emit("update:modelValue", $event.target.value)
    }

    function getMaszynaById() {
        return useQuery(["idMaszyny"], ()=>fetchCall("maszyny","get",null,idMaszyny.value));
    }
    function updateMaszynaIdAwarii() {
        return useMutation((thisMaszyna)=>fetchCall("maszyny","put",thisMaszyna,idMaszyny.value));
    }
    function postAwaria() {
        return useMutation((newAwaria)=>fetchCall("awaria","post",newAwaria))
    }
    const awariaAlert = async (dataMaszyna) => {
      const alert=await alertController.create({
          header:'Dodać wpis o awarii?',
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
                  addAwaria(dataMaszyna)
              },
          },
          ]
      })
      await alert.present();
    };

    const {data: dataMaszyna, isLoading:modalIsLoadingStatus, isError:modalIsErrorStatus } = getMaszynaById();
    const {mutate, isLoading,isError,error,isSuccess, data} = postAwaria();
    const {mutate:maszynaMutate}= updateMaszynaIdAwarii();
    console.log("marka:"+dataMaszyna.marka)

    function addAwaria(maszyna){
      mutate({
        stan:true,dataZgloszenia:new Date(),opis:modelValue.value},{
          onSuccess:(data)=>{
            console.log(data.idAwarii)
            maszynaMutate({
              marka:maszyna.marka,
              model:maszyna.model,
              opis:maszyna.opis,
              nazwa:maszyna.nazwa,
              kategoria:maszyna.kategoria,
              idAwarii:data.idAwarii,
              dataPrzegladu:maszyna.dataPrzegladu,
            })
          }
        });
      console.log(data.idAwarii)
    }
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
        <ion-card style="padding:0px;margin:0px">
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
              <ion-label v-if="dataMaszyna.dataPrzegladu!=null">Ostatni przegląd: {{dataMaszyna.dataPrzegladu.split(".")[0].replace("T"," ").slice(0,-3).slice(2)}}</ion-label>
              <ion-label color="danger" v-else>Ostatni przegląd: BRAK PRZEGLĄDU</ion-label>
            </ion-item>
          </ion-list>    
        </ion-card>

        <!-- @input="$emit('update:modelValue', $event.target.value)" -->

        <ion-card style="padding:0px;margin:0px">
          <ion-item>
            <ion-label position="stacked">Opisz awarię:</ion-label>
            <ion-textarea autoGrow="true" type="text" :value="modelValue" @input="updateModelValue" @change="$emit('change',$event.target.value)"></ion-textarea>
          </ion-item>
        </ion-card>
        
        <ion-card style="padding:0px;margin:0px">
          <ion-list style="text-align:center" color="warning">
            <ion-button  fill="clear" color="success" expand="block" @click="awariaAlert(dataMaszyna)">Zgłoś awarię</ion-button>
          </ion-list>
        </ion-card>
      </span>

      <span v-if="isLoading">
        <ion-card style="display:flex;padding:0px;margin:0px ">
          <div class="ion-justify-content-center">
            <pulse-loader :loading="loading" :color="primary"></pulse-loader>
          </div>
        </ion-card>
      </span>
      <span v-if="isError">
        <ion-card >
          <ion-item>
            <p>Wystąpił błąd: {{error.message}}</p>
          </ion-item>
        </ion-card>
      </span>
      <span v-if="isSuccess">
        <ion-card style="background-color:green">
          <ion-item>
            <h2>Awaria pomyślnie zapisana.</h2>
          </ion-item>
        </ion-card>
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
    name: "AwariaAddModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton },
  });
  </script>
  