<script setup>
    import { useQuery } from "vue-query";
    import { fetchCall } from '../helpers/fetch-caller';
    import { defineProps, toRefs,ref,defineExpose,defineEmits} from "vue";
    import {modalController,alertController} from "@ionic/vue"
    
    const props = defineProps({
      idStatusu:Number,
    });
    const closeModal = () => {
      modalController.dismiss();
    };
    const surowceInputs=ref([])
    const surowceValues=ref([])
    const opisEtapuInput=ref("")
    const opisEtapuValue=ref("")
    const {idStatusu} = toRefs(props)
   
    const emit = defineEmits([
      "update:surowceInputs",
      "update:opisEtapu",
      "change",
    ])
    const updateSurowce = ($event,index,surowiec) => {
      surowceInputs.value[index] = $event.target.value
      surowceValues.value[index] = {
        id:surowiec.id,
        stan:surowiec.stan,
        idEtapu:surowiec.idEtapu,
        faktycznaIlosc:$event.target.value,
        idSurowca:surowiec.idSurowca
      }
      emit("update:surowceInputs", $event.target.value)
    }
    const updateOpisEtapu = ($event,status) => {
      opisEtapuInput.value = $event.target.value
      opisEtapuValue.value={
        stan:status.stan,
        idZlecenia:status.idZlecenia,
        idPracownika:status.idPracownika,
        idEtapu:status.idEtapu,
        idMaszyny:status.idMaszyny,
        czasTrwania:status.czasTrwania,
        notatki: $event.target.value
      }
      emit("update:opisEtapu", $event.target.value)
    }

    function getStatusById() {
      return useQuery(["statusGet"], ()=>fetchCall("status","get",null,idStatusu.value));
    }

    function submitChanges(mode,status){
      surowceValues.value.forEach(surowiec=>{
        console.log(surowiec)
        if(surowiec!==""){
          fetchCall("surowcedlaetapu","put",{    
            stan:surowiec.stan,
            idEtapu:surowiec.idEtapu,
            faktycznaIlosc:surowiec.faktycznaIlosc,
            idSurowca:surowiec.idSurowca
          },surowiec.id)

        }
      });
      if(mode=='save'){
        opisEtapuValue.value={
          stan:true,
          idZlecenia:status.idZlecenia,
          idPracownika:status.idPracownika,
          idEtapu:status.idEtapu,
          idMaszyny:status.idMaszyny,
          czasTrwania:status.czasTrwania,
          notatki: opisEtapuInput.value
        }
      }
      if(opisEtapuValue.value.notatki!=null||mode=='save'){
        fetchCall("status","put",opisEtapuValue.value,idStatusu.value)
      }
    }

    const {data:dataStatus, isLoadingStatus:modalIsLoadingStatus, isErrorStatus:modalIsErrorStatus } = getStatusById();
    
    function checkSurowce(dataStatus){
      let checkr = 0
      dataStatus.idEtapuNavigation.surowceDlaEtapus.forEach(surowiec => {
        surowceInputs.value.push('');
        surowceValues.value.push('');
        if(surowiec.faktycznaIlosc==null||(surowiec.faktycznaIlosc<surowiec.potrzebnaIlosc&&surowiec.faktycznaIlosc!=null)){
          checkr=checkr+1
        }
      })
      if(checkr>0){
        return false
      }
      else{
        return true
      }
    }
    const saveChangesAlert = async (mode,status) => {
      const alert=await alertController.create({
          header:'Czy chcesz zapisać zmiany?',
          buttons:[
          {
              text: 'Wróć',
              role: 'cancel',
              handler: () => {
                  },
          },
          {
              text: 'Zapisz',
              role: 'confirm',
              handler: () => {
                submitChanges(mode,status)
              },
          },
          ]
      })
      await alert.present();
    };
    defineExpose({
      surowceInputs
    })

</script>

<template>

  <ion-header>
    <ion-toolbar>
      <span v-if="dataStatus!=null">
        <ion-title>Etap: {{dataStatus.idEtapuNavigation.nazwa}}</ion-title>
      </span>
      <ion-buttons slot="end">
        <ion-button @click="closeModal">WYJDŹ</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  
  <ion-content class="ion-padding">
    <ion-refresher slot="fixed" @ionRefresh="reloadPage">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
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
      <div v-if="dataStatus"> 
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
          <ion-label>Stanowisko:</ion-label>
          <ion-label slot="end" @click="openMaszynaModal(dataStatus.idMaszyny)">
            <h2>{{dataStatus.idMaszynyNavigation.nazwa}}</h2>
            <p>{{dataStatus.idMaszynyNavigation.marka}} {{dataStatus.idMaszynyNavigation.model}}</p>
          </ion-label>
        </ion-item>
        <ng-container>
          <ion-list style="text-align:center">
            <ion-button v-if="dataStatus.idMaszynyNavigation.idAwariaNavigation.stan==false || dataStatus.idMaszynyNavigation.idAwarii<1" expand="block" fill="clear" color="transparent" @click="openAwariaAddModal(dataStatus.idMaszyny)">ZGŁOŚ AWARIĘ MASZYNY</ion-button>
            <ion-button v-else expand="block" fill="clear" color="danger" @click="openAwariaViewModal(dataStatus.idMaszynyNavigation.idAwarii)">AWARIA MASZYNY</ion-button>
          </ion-list>
        </ng-container>
        
        <ion-card style="padding:0px;margin:0px">
          <ion-card-header>
            <ion-card-title>Wymagane surowce:</ion-card-title>
          </ion-card-header>
          <ion-card-content>  
            <ion-item v-for="(surowiec,index) in dataStatus.idEtapuNavigation.surowceDlaEtapus" :key="index">                                           
              <ion-label position="fixed">{{surowiec.idSurowceNavigation.nazwa}}</ion-label>
                <ion-item>
                  <ion-input v-if="surowiec.faktycznaIlosc==null||surowiec.faktycznaIlosc==0" :id="index" :value="surowceInputs[index]" @input="updateSurowce($event,index,surowiec)" @change="$emit('change',$event.target.value)" placeholder="Brak" color="danger"></ion-input>
                  <ion-input v-if="surowiec.faktycznaIlosc<surowiec.potrzebnaIlosc&&surowiec.faktycznaIlosc!=null&&surowiec.faktycznaIlosc!=0" :id="index" :placeholder="surowiec.faktycznaIlosc" :value="surowceInputs[index]" @input="updateSurowce($event,index,surowiec)" @change="$emit('change',$event.target.value)" color="warning"></ion-input>
                  <ion-input v-if="surowiec.faktycznaIlosc>=surowiec.potrzebnaIlosc&&surowiec.faktycznaIlosc!=null" :id="index" :placeholder="surowiec.faktycznaIlosc" :value="surowceInputs[index]" @input="updateSurowce($event,index,surowiec)" @change="$emit('change',$event.target.value)" color="success"></ion-input>
                </ion-item>
                <p>/</p>
                <ion-item>
                  <ion-input readonly="true" :value="surowiec.potrzebnaIlosc"></ion-input>
                </ion-item>
              </ion-item> 
          </ion-card-content>
        </ion-card>
        
        <ion-card style="padding:0px;margin:0px">
          <ion-card-header>Notatki do etapu:</ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-textarea autoGrow="true" :placeholder="dataStatus.notatki" :value="opisEtapuInput" @input="updateOpisEtapu($event,dataStatus)" @change="$emit('change',$event.target.value)"></ion-textarea>
            </ion-item>
          </ion-card-content> 
        </ion-card>
        
        <ng-container style="padding:0px;margin:0px" v-if="!dataStatus.stan">
          <ion-list style="text-align:center;padding:0px;padding-bottom:5px;margin:0px;margin-top:10px" >
            <ion-button v-if="checkSurowce(dataStatus)" expand="block" fill="clear" color="success" @click="saveChangesAlert('save',dataStatus)"><h6>Zapisz zmiany i zakończ etap</h6></ion-button>
            <ion-button v-else expand="block" fill="clear" color="transparent" @click="saveChangesAlert('',dataStatus)"><h3>Zapisz zmiany</h3></ion-button>
          </ion-list>
        </ng-container>
      </div>
    </span>
  </ion-content>

</template>
  
  <script>
  import {
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonSkeletonText, IonListHeader, IonThumbnail, IonLabel, IonItem, IonList, IonCard, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, IonInput, IonTextarea, IonRefresher, IonRefresherContent
  } from "@ionic/vue";
  import { defineComponent } from "vue";
  import MaszynaModal from "@/components/MaszynaModal.vue";
  import AwariaViewModal from "@/components/AwariaViewModal.vue";
  import AwariaAddModal from "@/components/AwariaAddModal.vue";
  export default defineComponent({
    name: "StatusModal",
    components: { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonSkeletonText, IonListHeader, IonThumbnail, IonLabel, IonItem, IonList, IonCard, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, IonInput, IonTextarea, IonRefresher, IonRefresherContent },
    methods: {
      async openMaszynaModal(passedMaszyna){
        const modal = await modalController.create({
          component: MaszynaModal, 
          componentProps:{
            idMaszyny:passedMaszyna
          }
        });
        return modal.present();
      },
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
      reloadPage() {
        window.location.reload();
      }
    }
  });
  </script>
 