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
      idMaszyny:Number,
      modelValue:{
        type:String,
        default:""
      }
    });
    const {idMaszyny} = toRefs(props)
    console.log("idMaszyny: "+idMaszyny)

    const updateModelValue = ($event) => {
        modelValue.value = $event.target.value
        emit("update:modelValue", $event.target.value)
    }

    function getMaszynaById() {
        return useQuery(["idMaszyny"], ()=>fetchCall("maszyny","get",null,idMaszyny.value));
    }
    function postAwaria() {
        return useMutation((newAwaria)=>fetchCall("awaria","post",newAwaria));
    }
    function addAwaria(){
      mutate({stan:true,dataZgloszenia:new Date(),opis:modelValue.value});
      console.log(modelValue.value)
    }
    const awariaAlert = async () => {
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
                  addAwaria()
              },
          },
          ]
      })
      await alert.present();
    };

    const {data: dataMaszyna, isLoading:modalIsLoadingStatus, isError:modalIsErrorStatus } = getMaszynaById();
    const {mutate, isLoading,isError,error,isSuccess} = postAwaria();


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
          <ion-label v-if="dataMaszyna.dataPrzegladu!=null">Ostatni przegląd: {{dataMaszyna.dataPrzegladu}}</ion-label>
          <ion-label color="danger" v-else>Ostatni przegląd: BRAK PRZEGLĄDU</ion-label>
        </ion-item>
      </ion-list>    
    </ion-card>

    <!-- @input="$emit('update:modelValue', $event.target.value)" -->

    <ion-card>
      <ion-item>
        <ion-label position="stacked">Opisz awarię:</ion-label>
        <ion-textarea autoGrow="true" type="text" :value="modelValue" @input="updateModelValue" @change="$emit('change',$event.target.value)"></ion-textarea>
      </ion-item>
    </ion-card>
    
    <ion-card>
        <ion-list style="text-align:center" color="warning">
          <ion-button  fill="clear" color="success" expand="block" @click="awariaAlert()">Zgłoś awarię</ion-button>
        </ion-list>
      </ion-card>
      
      <span v-if="isLoading">
        <ion-card style="display: flex ">
          <div class="ion-justify-content-center">
            <pulse-loader :loading="loading" :color="primary"></pulse-loader>
          </div>
        </ion-card>
      </span>
      <span v-if="isError">
        <ion-card>
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
  