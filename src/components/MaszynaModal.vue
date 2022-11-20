<script setup>
    
    import { useQuery,useMutation } from "vue-query";
    import { fetchCall } from '../helpers/fetch-caller';
    import { defineProps, toRefs} from "vue";
    import {modalController,alertController} from "@ionic/vue"
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
    function updateMaszynaPrzeglad() {
        return useMutation((thisMaszyna)=>fetchCall("maszyny","put",thisMaszyna,idMaszyny.value));
    }
    function addPrzeglad(maszyna){
      maszynaMutate({
          marka:maszyna.marka,
          model:maszyna.model,
          opis:maszyna.opis,
          nazwa:maszyna.nazwa,
          kategoria:maszyna.kategoria,
          idAwarii:maszyna.idAwarii,
          dataPrzegladu:new Date(),
        })
    }
    console.log()
    const przegladAlert = async (dataMaszyna) => {
      const alert=await alertController.create({
          header:'Zaznaczyć wykonanie przeglądu?',
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
                  addPrzeglad(dataMaszyna)
              },
          },
          ]
      })
      await alert.present();
    };
    const {data: dataMaszyna, isLoadingStatus:modalIsLoadingStatus, isErrorStatus:modalIsErrorStatus } = getMaszynaById();
    const {mutate:maszynaMutate}= updateMaszynaPrzeglad();
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
      <div v-if="dataMaszyna">
        <ion-card style="text-align:center;padding:0px;margin:0px">
          <ion-list lines="full">
            <ion-item style="text-align:center;">
              <ion-label><p>Kategoria: {{dataMaszyna.kategoria}}</p></ion-label>
            </ion-item>
            <ion-item style="text-align:center;">
              <ion-label>Marka: {{dataMaszyna.marka}}</ion-label>
            </ion-item>
            <ion-item style="text-align:center;">
              <ion-label>Model: {{dataMaszyna.model}}</ion-label>
            </ion-item>
            <ion-item @click="przegladAlert(dataMaszyna)" style="text-align:center;">
              <ion-label v-if="dataMaszyna.dataPrzegladu!=null">Ostatni przegląd: {{dataMaszyna.dataPrzegladu.split(".")[0].replace("T"," ").slice(0,-3).slice(2)}}</ion-label>
              <ion-label color="danger" v-else>Ostatni przegląd: BRAK PRZEGLĄDU</ion-label>
            </ion-item>
          </ion-list>    
        </ion-card>
       

          <ion-card style="padding:0px;margin:0px">
            <ion-list style="text-align:center;margin:0px;padding:5px">
              <ion-button v-if="dataMaszyna.idAwariaNavigation==true || dataMaszyna.idAwarii<1" expand="block" fill="clear" color="transparent" @click="openAwariaAddModal(dataMaszyna.idMaszyny)">ZGŁOŚ AWARIĘ MASZYNY</ion-button>
              <ion-button v-else expand="block" fill="clear" color="danger" @click="openAwariaViewModal(dataMaszyna.idAwarii)"><h4>AWARIA MASZYNY</h4></ion-button>
            </ion-list>
          </ion-card>
      
          <ion-card style="padding:0px;margin:0px;margin-top:5px">
            <ion-accordion-group >
              <ion-accordion>
                <ion-item slot="header" color="light" style="text-align: center;">
                  <ion-label slot="start">Przypisane etapy:</ion-label>
                </ion-item>
                <div slot="content" style="padding:5px; text-align: center;" @click="openStatusModal(status.idStatusu)" v-for="status in dataMaszyna.statuses" :key="status.idEtapu">
                  <ion-label color="dark"><h2>{{status.idEtapuNavigation.nazwa}}</h2>//zlec.{{status.idZlecenia}}</ion-label>
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-card>
        </div>
      </span>
    </ion-content>
  </template>
  
  <script>
  import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonSkeletonText, IonListHeader, IonThumbnail, IonLabel, IonItem, IonList, IonCard, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, IonAccordion, ionAccordionGroup,
  } from "@ionic/vue";
  import { defineComponent } from "vue";
  import AwariaViewModal from "@/components/AwariaViewModal.vue";
  import AwariaAddModal from "@/components/AwariaAddModal.vue";
  import StatusModal from "@/components/StatusModal.vue";


  export default defineComponent({
    name: "MaszynaModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonSkeletonText, IonListHeader, IonThumbnail, IonLabel, IonItem, IonList, IonCard, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, IonAccordion, ionAccordionGroup, },
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
  