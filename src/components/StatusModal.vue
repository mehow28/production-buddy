<script setup>
    import { useQuery } from "vue-query";
    import { fetchCall } from '../helpers/fetch-caller';
    //const idStat = this.idStatusu; 
    function getStatusById() {
        return useQuery(["idStatusu"], ()=>fetchCall("status","get",null,idStat));
    }
    const {data: dataStatus, isLoadingStatus:modalIsLoadingStatus, isErrorStatus:modalIsErrorStatus } = getStatusById();

</script>

<template>
   
   <!-- <ion-header>
      <ion-toolbar>
        <ion-title>machinemodal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      {{idStatusu}} <br />
      <ion-button @click="closeModal">Close Modal</ion-button>
    </ion-content> -->




        
          <ion-header>
            <ion-toolbar>
              <span v-if="dataStatus!=null">
                <ion-title>Etap: {{dataStatus.idEtapuNavigation.nazwa}}</ion-title>
              </span>
              <ion-buttons slot="end">
                <ion-button @click="setOpen(-1)">WYJDŹ</ion-button>
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
            
            <span v-else>
              
              <span v-if="dataStatus.stan">
                <ion-item color="success">
                  <ion-label style="text-align:center"><h1>Etap ukończony</h1></ion-label>
                </ion-item>
              </span>
              <span v-else>
                <ion-item color="warning">
                  <ion-label style="text-align:center"><h1>Etap nieukończony</h1></ion-label>
                </ion-item>
              </span>
              <ion-item>
                <ion-labels>Stanowisko:</ion-labels>
                <ion-label slot="end" @click="openMachineModal">
                  <h2>{{dataStatus.idMaszynyNavigation.nazwa}}</h2>
                  <p>{{dataStatus.idMaszynyNavigation.marka}} {{dataStatus.idMaszynyNavigation.model}}</p>
                </ion-label>
              </ion-item>
              <ng-container>
                <ion-list style="text-align:center">
                  <ion-button expand="block" fill="clear" color="transparent" @click="openAwariaModal()">ZGŁOŚ AWARIĘ MASZYNY</ion-button>
                </ion-list>
              </ng-container>
              
              <ion-card>
                <ion-card-header>
                  <ion-card-title>Wymagane surowce:</ion-card-title>
                </ion-card-header>
                <ion-card-content>  
                  <ion-item v-for="surowiec in dataStatus.idEtapuNavigation.surowceDlaEtapus" :key="surowiec.id">                                           
                    <ion-label position="fixed">{{surowiec.idSurowceNavigation.nazwa}}</ion-label>
                      <ion-item>
                        <ion-input :id="surowiec.id" :value="surowiec.faktycznaIlosc"></ion-input>
                      </ion-item>
                      <p>/</p>
                      <ion-item>
                        <ion-input readonly="true" :value="surowiec.potrzebnaIlosc"></ion-input>
                      </ion-item>
                    </ion-item> 
                </ion-card-content>
              </ion-card>
             
              <ion-card>
                <ion-card-header>Notatki do etapu:</ion-card-header>
                <ion-card-content>
                  <ion-item>
                    <ion-textarea autoGrow="true" :value="dataStatus.idEtapuNavigation.opis"></ion-textarea>
                  </ion-item>
                </ion-card-content> 
              </ion-card>

              <ion-card>
                <ion-card-content>
                  <ion-list style="text-align:center">
                    <ion-button expand="block" fill="clear" color="transparent">Zapisz zmiany</ion-button>
                  </ion-list>
                </ion-card-content>
              </ion-card>

              <!-- fill="clear" color="transparent" -->


              <ion-grid>
                <ion-row class="ion-align-items-center">
                  <ion-button>Zapisz zmiany</ion-button>
                </ion-row> 
              </ion-grid> 

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
    modalController,
  } from "@ionic/vue";
  import { defineComponent,ref } from "vue";
  
  export default defineComponent({
    name: "StatusModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton },
    props:{
        idStatusu:Number
    },
    setup(props) {
      const closeModal = () => {
        modalController.dismiss();
      };
      const idStat = ref(props.idStatusu)
      return { closeModal,idStat };
    },
    methods:{
        getStatusById() {
            return useQuery(["idStatusu"], ()=>fetchCall("status","get",null,this.idStat));
        }
    }
  });
  </script>
  