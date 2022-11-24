<script setup>
    import {modalController,alertController} from "@ionic/vue";
    import {useQuery} from "vue-query";
    import { fetchCall } from '../helpers/fetch-caller';
    import {ref,defineExpose} from 'vue';
    const closeModal = () => {
      modalController.dismiss();
    };
    const idZleceniaValue=ref("")   
    const idPracownikaValue=ref("")   
    const idEtapuValue=ref("")    
    const idMaszynyValue=ref("")
    const czasTrwaniaValue=ref("")

    const opisEtapu=ref("")
    function getZlecenia() {
      return useQuery(["allZlecenia"], ()=>fetchCall("zlecenium","get",null,null));
    }
    function getEtapy() {
      return useQuery(["allEtapy"], ()=>fetchCall("etapy","get",null,null));
    }
    function getPracownicy() {
      return useQuery(["allPracownicy"], ()=>fetchCall("pracownicy","get",null,null));
    }
    function getMaszyny() {
      return useQuery(["allMaszyny"], ()=>fetchCall("maszyny","get",null,null));
    }
    const{data:dataZlecenia} = getZlecenia();
    const{data:dataEtapy} = getEtapy();
    const{data:dataPracownicy} = getPracownicy();
    const{data:dataMaszyny} = getMaszyny();
    
    const statusPost = () =>{
      fetchCall("status","post",{    
            stan:false,
            idZlecenia:idZleceniaValue.value,
            idPracownika:idPracownikaValue.value,
            idEtapu:idEtapuValue.value,
            idMaszyny:idMaszynyValue.value,
            czasTrwania: parseInt(czasTrwaniaValue.value),
            notatki:opisEtapu.value
          },null).then(
            successAlert()
          )
    }
    const successAlert = async () => {
      const alert=await alertController.create({
          header:'Pomyślnie zapisano etap.',
          buttons:[
          {
              text: 'Ok',
              role: 'confirm',
              handler: () => { 
              },
          },
          ]
      })
      await alert.present();
    };
    const saveChangesAlert = async () => {
      const alert=await alertController.create({
          header:'Czy chcesz zapisać etap?',
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
                statusPost()
              },
          },
          ]
      })
      await alert.present();
    };

    defineExpose({
      idZleceniaValue,
      idPracownikaValue,
      idEtapuValue,
      idMaszynyValue,
      czasTrwaniaValue,
      opisEtapu
    })
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Dodawanie etapu</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeModal">WYJDŹ</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-card>

        <ion-card-header style="margin:5px;padding:0px">
          <ion-grid>
            <ion-row class="align-items-flex-end">
              <ion-col width-50 style="margin-bottom:5px">
            <ion-label ><p>Wybierz zlecenie:</p></ion-label>
          </ion-col>
              <ion-col width-50>  
            <ion-select v-if="dataZlecenia" interface="action-sheet" cancelText="Anuluj" v-model="idZleceniaValue">
                <div v-for="zlecenie in dataZlecenia" :key="zlecenie.idZlecenia">
                    <ion-select-option :value="zlecenie.idZlecenia">{{zlecenie.idProduktuNavigation.nazwa}}</ion-select-option>
                </div>
            </ion-select>
          </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-header>

        <ion-card-header style="margin:5px;padding:0px">
          <ion-grid>
            <ion-row class="align-items-flex-end">
              <ion-col width-50 style="margin-bottom:5px">
            <ion-label ><p>Wybierz pracownika:</p></ion-label>
          </ion-col>
              <ion-col width-50>  
            <ion-select v-if="dataPracownicy" interface="action-sheet" cancelText="Anuluj" v-model="idPracownikaValue">
                <div v-for="pracownik in dataPracownicy" :key="pracownik.idPracownika">
                    <ion-select-option :value="pracownik.idPracownika">{{pracownik.imie}} {{pracownik.nazwisko}}</ion-select-option>
                </div>
            </ion-select>
          </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-header>

        <ion-card-header style="margin:5px;padding:0px">
          <ion-grid>
            <ion-row class="align-items-flex-end">
              <ion-col width-50 style="margin-bottom:5px">
               <ion-label ><p>Wybierz etap produkcji:</p></ion-label>
              </ion-col>
              <ion-col width-50>           
               <ion-select v-if="dataEtapy" interface="action-sheet" cancelText="Anuluj" v-model="idEtapuValue">
                <div v-for="etap in dataEtapy" :key="etap.idEtapu">
                    <ion-select-option :value="etap.idEtapu">{{etap.nazwa}}</ion-select-option>
                </div>
            </ion-select>
          </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-header>

        <ion-card-header style="margin:5px;padding:0px">
          <ion-grid>
            <ion-row class="align-items-flex-end">
              <ion-col width-50 style="margin-bottom:5px">
                <ion-label><p>Wybierz maszynę:</p></ion-label>
              </ion-col>
              <ion-col width-50>
                <ion-select v-if="dataMaszyny" interface="action-sheet" cancelText="Anuluj" v-model="idMaszynyValue">
                  <div v-for="maszyna in dataMaszyny" :key="maszyna.idMaszyny">
                    <ion-select-option :value="maszyna.idMaszyny">{{maszyna.nazwa}} //{{maszyna.marka}} {{maszyna.model}}</ion-select-option>
                  </div>
                </ion-select>
              </ion-col>
            </ion-row>
          </ion-grid>            
        </ion-card-header>

        <ion-card-header style="margin:5px;padding:0px">
          <ion-grid>
            <ion-row class="align-items-flex-end">
              <ion-col width-50 style="margin-bottom:5px">
                <ion-label ><p>Podaj czas trwania: </p></ion-label>
              </ion-col>
            <ion-col width-50>
                <ion-input class="ion-text-right" style="margin-right:5px" placeholder="1 " v-model="czasTrwaniaValue"></ion-input>
              </ion-col>
            </ion-row>
          </ion-grid>            
        </ion-card-header>


        <ion-card-header style="margin:5px;padding:0px">
          <ion-grid>
            <ion-row class="align-items-flex-end">
              <ion-col>
                <ion-label ><p>Wpisz opis:</p></ion-label>
              </ion-col>
            </ion-row>
            <ion-row width-50>
              <ion-textarea placeholder="..." autoGrow="true" v-model="opisEtapu"></ion-textarea>
            </ion-row>
          </ion-grid>        
        </ion-card-header>
        <ng-container style="padding:0px;margin:0px">
          <ion-list style="text-align:center;padding:0px;padding-bottom:5px;margin:0px;margin-top:10px" >
           <ion-button expand="block" fill="clear" color="transparent" @click="saveChangesAlert"><h3>DODAJ ETAP</h3></ion-button>
          </ion-list>
        </ng-container>
    </ion-card>
  </ion-content>
  
  <div v-if="dataEtapy"><div v-if="dataPracownicy"><div v-if="dataMaszyny"></div></div></div>
</template>

<script>
import{
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,IonSelect,IonSelectOption,IonCardHeader,
    IonCard,IonContent,IonLabel, IonTextarea, IonCol, IonRow, IonGrid, IonInput, IonList
} from "@ionic/vue";
import { defineComponent } from "vue";
export default defineComponent({
    name:"StatusAddModal",
    components: { 
      IonButtons, IonHeader, IonTitle, IonToolbar, IonButton,IonSelect,IonSelectOption,IonCardHeader,
      IonCard,IonContent,IonLabel, IonTextarea, IonCol, IonRow, IonGrid, IonInput, IonList
    },
    methods:{
      reloadPage() {
        window.location.reload();
      }
    }
})
</script>
<style>
.align-items-flex-end {
    align-items: flex-end;
    -webkit-align-items: flex-end;
}
</style>