<template>
  <q-page class="q-pa-sm page font">

    <q-page-scroller position="top" :scroll-offset="100" :offset="[18, 18]" style="z-index: 110;">
       <div class="text-white bg-red q-py-sm q-px-sm text-center text-caption" style="border-radius: 5px;"  >
        Poeira Cósmica: {{ cosmicDustCount | formatNumber }}
      </div>
    </q-page-scroller>

    <div class="fit justify-center flex q-gutter-y-sm">
      <q-btn color="blue" label="opções" :class="isMobileOptions" class="q-mr-md" @click="toggleDialog" />
      <q-btn color="warning" label="conquistas" :class="isMobileOptions" class="q-mr-md" @click="achievementsCheck" />
    </div>

    <!-- CONQUISTAS -->
    <q-dialog v-model="achievements" maximized>
      <q-card class="achive font">
        <q-card-actions class="col">
          <div class="col text-right text-white">
            <q-btn icon="close" flat dense v-close-popup size="25px"/>
          </div>
        </q-card-actions>
        <div class="col text-center text-white text-h6">Conquistas</div>
        <q-card-section class="flex justify-center">
          <q-list v-for="(item, index) in game.achievementsList" :key="index" class="starship__item-list text-white starship__item-list--achiv" >
            <q-item-section>
              <q-icon v-if="!item.conquest" name="img:https://www.flaticon.com/premium-icon/icons/svg/1321/1321744.svg" size="80px" />
              <div v-if="item.conquest" class="starship__item-list--achiv">
                <div class="q-ml-sm q-py-sm text-capitalize text-center">{{ item.label }}</div>
                <div class="q-px-sm starship__item-description starship__item-description--achivDescrip">{{ item.description }}</div>
              </div>
            </q-item-section>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- MENU DE OPÇÕES -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 100px;" class="flex justify-center pixel-borders--1 font">
        <q-card-section class="column q-gutter-y-md">
          <!-- TODO criar um modal com uma msg e uma img dizendo que o jogo será resetado e sem tem certeza disso -->
          <div>
            <q-btn label="Reset" @click="resetGame" style="min-width: 200px;" color="negative" />
          </div>
          <div>
            <q-btn label="contato" class="bg-blue text-white" style="min-width: 200px;" @click="contactCard"/>
          </div>
          <div>
            <q-btn class="bg-orange-6 fit" color="white" label="Música" :icon="iconAudio" @click="audioToggle"/>
          </div>
         <!-- TODO criar controle de volume -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- QUADRO DE UPDATE -->
    <q-dialog v-model="game.info" :maximized="isMobileMaximized">
      <q-card style="min-width: 100px;" class="flex justify-center pixel-borders--1">
        <q-card-section class="column q-gutter-y-sm">
          <q-icon name="img:https://i.pinimg.com/originals/45/1a/27/451a27df78f84c8f671ec1e502a4fe97.gif" class="flex self-center robot"/>
          <!-- <div class="devDialog font pixel-borders--1">
            Olá, meu nome é Rafael e primeiramente desculpa pelos dados cosmicos perdidos estou trabalhando incansavelmente para chegar a um produto final e você claro é um TESTER, TESTERS são muitos
            importantes no desenvolvimento de um produto sabia? são eles que enchem minha caixa de emails com feedbacks que fazem o Jogo ser bem Melhor! Vou deixar anotado aqui o que mudei dessa vez ok!
          </div> -->

          <div class="font devDialog pixel-borders--1">
            <div class="text-center q-mb-sm text-bold">
              Update log 13/05/2021
            </div>
            <p>>Conquistas Completas, Todas estão disponíveis no jogo!</p>
            <p>>Resolvido Bug do Drone quando a Página Recarrega.</p>
            <p>>Os equipamentos agora mostra os status atuais</p>
            <p>>Foi adicionado um banner quando o contador de Poeira Cosmica não fica visivel, mostrando a quantidade atual.</p>
            <p>>Ajustes nos upgrades</p>
          </div>
        </q-card-section>

        <q-card-actions>
          <div class="q-mb-md font">
            <q-btn label="ok" @click="close()" class="bg-warning" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- STARDUST -->
    <div class="flex justify-center">
      <div :class="isMobile">
        <q-separator color="red" size="4px" />
        <div class="flex justify-center">
          <q-btn outline flat size="15px" :label="game.starCompanyName" @click="starCompany"/>
        </div>
        <div class="column items-center q-mb-md">
          <div style="font-size: 12px;">
            Poeira Cósmica: {{ cosmicDustCount | formatNumber}}
            <q-img src="../assets/cosmic.png" style="width: 18px" class="q-mb-xs"/>
          </div>
          <div style="font-size: 10px;">Por segundo: {{ game.cosmicDustPerSecond.toFixed(1) }}/s</div>
          <div class="q-mt-sm" style="font-size: 9px;">Ganho por click: {{ game.click }}</div>
        </div>

        <!-- PEGAR POEIRA -->
        <div class="justify-center flex">
          <q-icon v-if="game.droneFunction.droneSend" name="img:https://cdna.artstation.com/p/assets/images/images/025/411/868/original/tomas-sousa-drone1.gif?1585708550" size="50px" style="position: absolute;"/>
          <div v-if="game.cosmicDust === 0" class="text-black q-px-sm" style="position: absolute; font-size: 10px; background-color: white; width: 290px;">Clique na nave para pegar poeira cósmica...</div>
          <q-btn icon="img:https://i.gifer.com/origin/24/2432cf5ff737ad7d1794a29d042eb02e_w200.webp" flat round @click="getDust()" size="60px"/>
        </div>

        <q-separator class="q-mt-md" color="orange" size="4px" />
          <!-- TODO Criar lista com botão dropdown para exibir os itens -->
          <!-- EQUIPAMENTOS -->
        <div class="q-mt-md flex justify-center text-uppercase text-caption">
          <q-tabs v-model="equipamentBay" active-color="white" no-caps dense class="bg-warning text-white shadow-2 fit"  style="border-radius: 5px;" >
            <q-tab name="inventory" label="Equipamentos" icon="img:https://image.flaticon.com/icons/png/128/4665/4665249.png" />
            <q-tab name="missions" label="Missões" icon="img:https://img-premium.flaticon.com/png/512/1734/1734158.png?token=exp=1621052389~hmac=938a35b31581276c78299840ffc93856" />
            <!-- <q-tab name="armamentos" label="Armamentos">
              <img src="../assets/moon.png" alt="" style="width: 30px;">
            </q-tab> -->
          </q-tabs>
        </div>

        <q-tab-panels v-model="equipamentBay" animated style="background-color:rgba(0, 0, 0, 0.1);">
          <q-tab-panel name="inventory">
            <!-- DRONE -->
            <div v-if="!game.installDrone" class="text-black q-px-sm q-mt-lg q-mx-sm" style="border-radius: 5px; font-size: 10px; background-color: white;">Compre algum equipamento para ser usado aqui!</div>
            <div v-if="game.installDrone" class="q-ml-sm q-mt-lg justify-between flex">
              <q-btn icon="img:https://www.flaticon.com/premium-icon/icons/svg/4014/4014313.svg" :class="game.droneFunction.colorDrone" :label="game.droneFunction.labelDrone" size="12px" :disable="game.droneFunction.droneSend" @click="drone()"/>
              <q-btn outline :label="game.droneFunction.droneTimer" size="12px"/>
            </div>
            <div v-if="game.installDrone" class="q-mt-sm q-ml-sm" style="font-size: 8px;">
              <div class="flex justify-between">
                <div>Capacidade de Coleta do drone</div>
                <div>{{ game.items.drone.launchValue }}/s</div>
              </div>
              <div class="flex justify-between">
                <div>Tempo de lançamento</div>
                <div>{{ game.items.drone.timeLaunch }}s</div>
              </div>
              <div class="flex justify-between">
                <div>Tempo de recarga</div>
                <div>{{ game.items.drone.bateryRecover }}s</div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="missions"  style="font-size: 8px;" >
            <div class="text-white">
              <q-img src="https://i.pinimg.com/originals/19/d2/28/19d228e7cbd160555af5d92e3154b381.gif" style="border-radius: 8px; border-color: grey; border-style: solid; height: 120px;" class="q-my-sm" >
                <div class="absolute-bottom text-caption text-center">
                  #4 - Pizza Espacial
                </div>
                </q-img>

              <div class="text-caption">

                <p>Missão de exploração da lua</p>
              </div>
              <div class="text-justify">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum obcaecati ut non iusto ea consectetur deleniti reprehenderit ducimus. Suscipit, explicabo. Dolore consectetur omnis fugiat minima possimus quisquam sint eveniet cumque!
              </div>
               <div class="flex justify-between q-mt-sm">
                <div>Rendimento</div>
                <div>500/s</div>
              </div>
              <div class="flex justify-between q-mt-sm">
                <div>Custo</div>
                <div>5.000 <q-img src="../assets/cosmic.png" style="width: 18px" class="q-mb-xs"/></div>
              </div>
              <q-separator class="q-mt-md" color="warning" size="1px" />
            </div>

            <div class="text-white">
              <q-img src="https://i.imgur.com/9oO33CL.gif?noredirect" style="border-radius: 8px; border-color: grey; border-style: solid; height: 120px;" class="q-my-sm" >
                <div class="absolute-bottom text-caption text-center">
                  #4 - Pizza Espacial
                </div>
                </q-img>

              <div class="text-caption">

                <p>Comércio interstelar</p>
              </div>
              <div class="text-justify">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum obcaecati ut non iusto ea consectetur deleniti reprehenderit ducimus. Suscipit, explicabo. Dolore consectetur omnis fugiat minima possimus quisquam sint eveniet cumque!
              </div>
               <div class="flex justify-between q-mt-sm">
                <div>Rendimento</div>
                <div>500/s</div>
              </div>
              <div class="flex justify-between q-mt-sm">
                <div>Custo</div>
                <div>5.000 <q-img src="../assets/cosmic.png" style="width: 18px" class="q-mb-xs"/></div>
              </div>
              <q-separator class="q-mt-md" color="warning" size="1px" />
             </div>

             <div class="text-white">
              <q-img src="https://i.pinimg.com/originals/d8/ef/df/d8efdf8c2e2b4b2c8b4eb8b3fa79b5c9.gif" style="border-radius: 8px; border-color: grey; border-style: solid; height: 120px;" class="q-my-sm" >
              <div class="absolute-bottom text-caption text-center">
                  #4 - Pizza Espacial
                </div>
                </q-img>
              <div class="text-caption">

                <p>Pizza Espacial</p>
              </div>
              <div class="text-justify">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum obcaecati ut non iusto ea consectetur deleniti reprehenderit ducimus. Suscipit, explicabo. Dolore consectetur omnis fugiat minima possimus quisquam sint eveniet cumque!
              </div>
               <div class="flex justify-between q-mt-sm">
                <div>Rendimento</div>
                <div>500/s</div>
              </div>
              <div class="flex justify-between q-mt-sm">
                <div>Custo</div>
                <div>5.000 <q-img src="../assets/cosmic.png" style="width: 18px" class="q-mb-xs"/></div>
              </div>
              <q-separator class="q-mt-md" color="warning" size="1px" />
             </div>

                <div class="text-white">
              <q-img src="https://i.pinimg.com/originals/12/3f/56/123f56c7ee8793e6b31ee9f591478aac.gif"  style="border-radius: 8px; border-color: grey; border-style: solid; height: 120px;" class="q-my-sm" >
                <div class="absolute-bottom text-caption text-center">
                  #4 - Avaliação de dados
                </div>
              </q-img>
              <div class="text-caption">
                <p>Avaliação de dados</p>
              </div>
              <div class="text-justify">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum obcaecati ut non iusto ea consectetur deleniti reprehenderit ducimus. Suscipit, explicabo. Dolore consectetur omnis fugiat minima possimus quisquam sint eveniet cumque!
              </div>
               <div class="flex justify-between q-mt-sm">
                <div>Rendimento</div>
                <div>500/s</div>
              </div>
              <div class="flex justify-between q-mt-sm">
                <div>Custo</div>
                <div>5.000 <q-img src="../assets/cosmic.png" style="width: 18px" class="q-mb-xs"/></div>
              </div>
              <q-separator class="q-mt-md" color="warning" size="1px" />
             </div>
          </q-tab-panel>
        </q-tab-panels>

        <!-- <q-separator class="q-mt-md" color="blue" size="4px" /> -->

      </div>

      <!-- LISTA DE UPGRADES -->
      <q-dialog v-model="upgradeDialog" :maximized="isMobileMaximized">
        <q-card class="upgradeDialog">

          <q-card-actions class="flex justify-center">
            <div class="fit">
              <q-btn v-close-popup color="warning" label="fechar" class="fit font" size="12px" />
            </div>
            <div class="text-white bg-red-9 q-py-xs text-center text-caption fit font" style="border-radius: 5px;"  >
              Poeira Cósmica: {{ cosmicDustCount | formatNumber }}
            </div>
          </q-card-actions>

          <q-card-section class="q-ma-none q-pa-sm" >
            <q-list v-for="(update, index) in upgradesList" :key="index">
              <div class="devDialog font pixel-borders--1 q-my-xs upgradeDialog__item">
                <div class="flex justify-between no-wrap">
                  <div class="column starship__items q-mb-sm q-ml-sm" style="max-width: 80px ">
                    <div>
                      <img :src="update.img" style="width: 30px; height: 30px;">
                    </div>
                    <div class="text-capitalize" style="font-size: 8px;">{{ update.label }}</div>
                  </div>
                  <div class="column text-right q-mt-md">
                    <div>
                       Preço: {{  update.price | formatNumber }}
                      <q-img src="../assets/cosmic.png" style="width: 10px" class="q-mb-xs"/>
                    </div>
                    <div  v-if="update.idu !== 5" >Eficiência: +{{ update.value }}</div>
                    <div  v-if="update.label === 'Drone Pro'">Eficiência: +{{ update.value }}</div>
                    <!-- DRONE -->
                    <div v-if="update.label === 'Drone Sentinela'" >Coleta de Poeira: +{{ update.value }}</div>
                    <div v-if="update.label === 'Bateria de Drone'" >Coleta: +2s</div>
                    <div v-if="update.label === 'Bateria de Drone'" >Recarga: +1s</div>
                  </div>
                </div>
                <div class="q-px-md q-mt-sm starship__item-description" style="font-size: 8px;">{{ update.description }}</div>
                <q-btn label="comprar" size="15px" push color="green" :disable="game.cosmicDust < update.price" class="q-mt-md fit" @click="buyUpgrade(update)" />
              </div>
            </q-list>
          </q-card-section>

        </q-card>
      </q-dialog>
      <!-- TODO criar uma tab para items e equipamentos -->
      <!-- ITENS -->
      <div :class="isMobile" >
        <q-separator v-if="game.openShop !== 0" color="green" size="4px" />
        <div v-if="game.openShop !== 0" class="q-mt-xs q-mb-xs flex justify-center text-uppercase">
          Loja
          <q-tabs v-model="shop" active-color="white" no-caps dense class="bg-green text-white shadow-2 fit"  style="border-radius: 5px;" >
            <q-tab name="itens" icon="img:https://image.flaticon.com/icons/png/128/4665/4665249.png" label="Gadgets"/>
            <q-tab name="equipamentos" icon="img:https://img-premium.flaticon.com/png/512/4646/4646987.png?token=exp=1621028990~hmac=7600facc94288540fbde3b9e6b35a422" label="Equipamentos"/>
          </q-tabs>
        </div>

        <q-tab-panels  v-if="game.openShop > 0" v-model="shop" animated style="background-color: black;">
          <q-tab-panel name="itens">
            <q-list v-if="game.openShop > 0" bordered class="starship__item-list text-white" style="font-size: 8px;">
              <q-item v-for="(item, key) in gameItems" :key="key" class="starship__items">
                <q-item-section class="row">
                  <div v-if="game.openShop <= item.unlocked" class="fit dimmed not-avaliable"/>
                  <div class="flex justify-between">
                    <div class="row">
                      <img :src="item.img">
                    <div class="self-center q-ml-sm text-capitalize">{{ item.label }}</div>
                    </div>
                    <div class="column text-right">
                      <div>
                        Preço: {{ item.price | formatNumber }}
                        <q-img src="../assets/cosmic.png" style="width: 14px" class="q-mb-xs"/>
                      </div>
                      <div>Eficiência: {{ item.value | formatNumberDec }}/s</div>
                      <div>Total: {{ item.totalEfficiency.toFixed(1) }}/s</div>
                    </div>
                  </div>
                  <div class="self-end q-mb-xs">Compradas: {{ item.amount | formatNumber }} unidades</div>
                  <div class="q-px-md starship__item-description">{{ item.description }}</div>
                  <q-btn label="comprar" size="13px" push color="green" :disable="game.cosmicDust < item.price" class="q-mt-md" @click="buyItem(item)" />
                  <q-btn label="upgrade" size="13px" push color="blue" :disable="game.cosmicDust < item.price || item.amount === 0" class="q-mt-md" @click="upgrade(item)" />
                <q-separator color="black" size="1px" class="q-mt-md" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
          <q-tab-panel name="equipamentos">
            <q-list v-if="game.openShop > 0" bordered class="starship__item-list text-white" style="font-size: 8px;">
              <q-item v-for="(item, key) in gameEquipaments" :key="key" class="starship__items">
                <q-item-section class="row">
                  <div v-if="game.openShop <= item.unlocked" class="fit dimmed not-avaliable"/>
                  <div class="flex justify-between">
                    <div class="row">
                      <img :src="item.img">
                    <div class="self-center q-ml-sm text-capitalize">{{ item.label }}</div>
                    </div>
                    <div class="column text-right">
                      <div>
                        Preço: {{ item.price | formatNumber }}
                        <q-img src="../assets/cosmic.png" style="width: 14px" class="q-mb-xs"/>
                      </div>
                      <div>Eficiência: {{ item.value | formatNumberDec }}/s</div>
                      <div>Total: {{ item.totalEfficiency.toFixed(1) }}/s</div>
                    </div>
                  </div>
                  <div class="self-end q-mb-xs">Compradas: {{ item.amount | formatNumber }} unidades</div>
                  <div class="q-px-md starship__item-description">{{ item.description }}</div>
                  <q-btn label="comprar" size="15px" push color="green" :disable="game.cosmicDust < item.price" class="q-mt-md" @click="buyItem(item)" />
                  <q-btn label="upgrade" size="13px" push color="blue" :disable="game.cosmicDust < item.price || item.amount === 0" class="q-mt-md" @click="upgrade(item)" />
                <q-separator color="black" size="1px" class="q-mt-md" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>

        <div v-if="game.openShop === 0" class="flex fit">
          <q-btn label="Comprar Melhorias - 50" size="10px" color="positive" class="fit" flat  @click="open">
              <q-avatar class="q-ml-sm q-mb-xs self-center" size="20px"><img src="../assets/cosmic.png"></q-avatar>
          </q-btn>
        </div>

      </div>
    </div>

    <!-- NOME DA COMPANHIA -->
    <q-dialog v-model="setName">
        <q-card style="width: 300px">
          <q-card-section>
            <q-input v-model="game.starCompanyName" label="Qual nome da sua companhia?" placeholder="Nome da Companhia estelar" />
          </q-card-section>
         <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ok" v-close-popup />
        </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- CONTATO -->
    <q-dialog v-model="contact">
      <q-card class="contact">
        <q-card-section>
          <div class="">
            <div class="text-center text-bold">Rafael Martins</div>
            <div class="flex">
                <q-icon class="q-ml-xs" name="ion-logo-facebook" size="30px" />
                <div class="q-mt-xs q-ml-xs"><a style="text-decoration: none; color: black;" href="https://www.facebook.com/Far3ll274">facebook.com/Far3ll274</a></div>
            </div>
            <div class="flex q-mt-md ">
                <q-icon class="q-ml-xs" name="ion-logo-twitter" size="30px" />
                <p class="q-mt-xs q-ml-xs"><a style="text-decoration: none; color: black" href="https://twitter.com/Rafael_M274">@Rafael_M274</a></p>
            </div>
            <div class="flex">
                <div class="q-mt-xs q-ml-xs fit flex justify-between">
                  <div>
                    <q-icon name="ion-mail" size="30px" />
                    far3ll.274@gmail.com
                  </div>
                  <div>
                  <q-btn flat dense size="11px" icon="ion-copy" @click="copy()" />
                  </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ok" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="flex justify-center fit q-mt-md bg-grey-7 fit q-px-sm">
      <div class="text-black text-center" style="font-size: 8px;">
        Rafael Martins - <a target="_blank" style="text-decoration: none; color: yellow" href="https://github.com/RafaelM-DEv">https://github.com/RafaelM-DEv</a>
        Version {{ version }}
      </div>
    </div>

      <!-- SFX / MUSIC  -->
    <template class="text-center q-mt-sm">
      <audio ref="buyItem">
        <source src="../assets/buy.mp3">
      </audio>
    </template>

    <template class="text-center q-mt-sm">
      <audio ref="music" id="bg-audio"  loop>
        <source src="http://soundimage.org/wp-content/uploads/2016/03/Escape_Looping.mp3">
      </audio>
    </template>

    <!-- TODO interceptar asteroids com drone , pode conter inimigos! -->
    <!-- TODO equipamentos para melhorar drone, modelos de drone e equipamentos -->
    <!-- TODO criar menu do comandante, um tab que muda as missões -->
    <!-- TODO quadro de quests com níveis -->
    <!-- escanear area atras de obnjetos e criaturas -->
    <!-- explorar planetas, lua etc -->

    <!-- ASTEROID -->
     <q-dialog v-model="asteroidDialog" maximized>
      <q-card class="achive font">
        <q-card-actions class="col">
          <div class="col text-right text-white">
            <q-btn icon="close" flat dense v-close-popup size="25px"/>
          </div>
        </q-card-actions>
        <div class="col text-center text-white text-h6">asteroid</div>
        <q-card-section class="flex justify-center">
          <div>
            Tests
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import gsap from 'gsap'
import { copyToClipboard } from 'quasar'
const numeral = require('numeral')

export default {
  filters: {
    formatNumber: function (value) {
      return numeral(value).format('0,0') // displaying other groupings/separators is possible, look at the docs
    },

    formatNumberDec: function (value) {
      return numeral(value).format('0,0.0') // displaying other groupings/separators is possible, look at the docs
    }
  },
  data () {
    return {
      equipamentBay: 'inventory',
      shop: 'itens',
      asteroidDialog: false,
      volume: 1,
      iconAudio: 'volume_up',
      achievements: false,
      version: '1.2.5',
      oldVersion: '1.2.4',
      contact: false,
      upgradeDialog: false,
      dialog: false,
      setName: false,
      cosmicDustCount: 0,
      upgradesList: [],
      game: {
        droneFunction: {
          droneTimer: 0,
          labelDrone: 'Enviar Drone',
          colorDrone: 'bg-green',
          droneSend: false
        },
        installDrone: false,
        info: true,
        click: 1,
        openShop: 0,
        starCompanyName: 'Nome da Companhia',
        cosmicDust: 10000,
        cosmicDustPerSecond: 0,
        itemsBuyed: [],
        achievementsList: {
          AchivGarra: {
            id: 1,
            label: 'Meu primeiro item!',
            description: 'Conquistado após comprar o primeiro item.',
            conquest: false
          },
          achivGarraEfficiency: {
            id: 2,
            label: 'Mestre da Eficiência!',
            description: 'Garra com Eficiência acima de 30.',
            conquest: false
          },
          aerogelAmount: {
            id: 3,
            label: 'Vai um Aerogel ai?',
            description: 'Conquistado após comprar 20 Aerogel.',
            conquest: false
          },
          cosmicDust: {
            id: 4,
            label: '10k de Poeira não é o bastante!',
            description: 'Conquistado apos conseguir 10k de poeira cósmica.',
            conquest: false
          },
          cosmicDustPerSecond: {
            id: 5,
            label: 'Vamos automatizar Tudo!',
            description: 'Chegou a 1k de Poeira cósmica por segundo',
            conquest: false
          },
          droneAchiev: {
            id: 6,
            label: 'Enfim comprei um Drone!',
            description: 'Conquistado apos comprar um Drone.',
            conquest: false
          }
        },
        upgrades: [
          {
            idu: 1,
            uplink: 'garra',
            label: 'Click Pro',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/2725/2725783.svg',
            price: 100,
            value: 0.5,
            description: 'Aumenta o ganho do click.'
          },
          {
            idu: 1,
            uplink: 'garra',
            label: 'Garra Pro',
            img: 'https://www.flaticon.com/br/premium-icon/icons/svg/3936/3936056.svg',
            price: 200,
            value: 0.5,
            description: 'Aumenta a eficiência da Garra.'
          },
          {
            idu: 2,
            uplink: 'aerogel',
            label: 'Aerogel Pro',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/3049/3049596.svg',
            price: 1200,
            value: 2,
            description: 'Aumenta a eficiência do aerogel em +2'
          },
          {
            idu: 3,
            uplink: 'processor',
            label: 'Processador Pro',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/3804/3804975.svg',
            price: 3000,
            value: 3,
            description: 'Aumenta a eficiência da bateria em +3'
          },
          {
            idu: 4,
            uplink: 'scanner',
            label: 'Scanner',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/3270/3270577.svg',
            price: 5000,
            value: 5,
            description: 'Aumenta a eficiência do scanner em +5'
          },
          {
            idu: 5,
            uplink: 'drone',
            label: 'Drone Pro',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/4014/4014313.svg',
            price: 7000,
            value: 5,
            description: 'Aumenta a eficiência do drone em +5'
          },
          {
            idu: 5,
            uplink: 'drone',
            label: 'Drone Sentinela',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/4014/4014313.svg',
            price: 8000,
            value: 5,
            description: 'Aumenta a capacidade de coleta do drone lançado em +5'
          },
          {
            idu: 6,
            uplink: 'station',
            label: 'Bateria de Drone',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/4014/4014313.svg',
            price: 10000,
            value: 2,
            description: 'Aumenta o tempo de coleta do drone lançado em +2 e o tempo de recarga em +1.'
          }
        ],
        items: {
          garra: {
            id: 1,
            type: 'item',
            label: 'garra',
            img: 'https://www.flaticon.com/br/premium-icon/icons/svg/3936/3936056.svg',
            description: 'Ferramenta para ajudar na coleta de detritos.',
            price: 50,
            value: 0.5,
            amount: 0,
            unlocked: 0,
            ups: 0,
            totalEfficiency: 0
          },
          aerogel: {
            id: 2,
            type: 'item',
            label: 'aerogel',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/3049/3049596.svg',
            description: 'Material usado para ajudar na coleta de poeira cosmica.',
            price: 75,
            value: 2,
            amount: 0,
            unlocked: 2,
            ups: 0,
            totalEfficiency: 0
          },
          processor: {
            id: 3,
            type: 'item',
            label: 'Processador',
            img: 'https://img-premium.flaticon.com/png/512/1425/1425684.png?token=exp=1621051022~hmac=a4a5745f69d7218db2f552fc23259408',
            description: 'Material usado aumentar a capacidade de equipamentos eletrônicos.',
            price: 1150,
            value: 5,
            amount: 0,
            unlocked: 4,
            ups: 0,
            totalEfficiency: 0
          },
          scanner: {
            id: 4,
            type: 'item',
            label: 'scanner',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/3270/3270577.svg',
            description: 'Material usado para scanear asteroids.',
            price: 1300,
            value: 8,
            amount: 0,
            unlocked: 10,
            ups: 0,
            totalEfficiency: 0
          },
          drone: {
            id: 5,
            type: 'equipament',
            label: 'drone',
            img: 'https://www.flaticon.com/premium-icon/icons/svg/4014/4014313.svg',
            description: 'Equipamento / Drone pode ser lançado para coletar poeira cósmica.',
            price: 2000,
            value: 10,
            timeLaunch: 10,
            bateryRecover: 30,
            launchValue: 10, // capacidade de coleta
            amount: 0,
            unlocked: 20,
            ups: 0,
            totalEfficiency: 0,
            status: 'Pronto'
          },
          station: {
            id: 6,
            type: 'item',
            label: 'station',
            img: 'https://img-premium.flaticon.com/png/512/4639/4639296.png?token=exp=1621040481~hmac=710587e7fd504f92d282482a812339e8',
            description: 'Usado para lançar um drone e recarregar sua bateria',
            price: 1300,
            value: 8,
            amount: 0,
            unlocked: 10,
            ups: 0,
            totalEfficiency: 0
          }
        }
      }
    }
  },

  created () {
    this.getDustperSecond()
    this.saveGame()
  },

  mounted () {
    if (localStorage.getItem(this.version)) {
      try {
        this.game = JSON.parse(localStorage.getItem(this.version))
      } catch (e) {
        // localStorage.removeItem('game-1.2.0')
        console.log(e)
      }
    } else {
      localStorage.removeItem(this.oldVersion)
      this.saveGame()
    }
    this.recovery()
  },

  computed: {
    gameItems () {
      const items = this.gameItemsFilter()
      return items
    },

    gameEquipaments () {
      const items = this.gameEquipamentsFilter()
      return items
    },

    animatedNumber () {
      return this.game.cosmicDust.toFixed(0)
    },

    isMobileMaximized () {
      return this.$q.screen.lt.sm
    },

    isMobile () {
      return this.$q.screen.lt.sm ? 'q-mt-md starship pixel-borders--1 text-white' : 'q-mt-md starshipDesktop no-wrap text-white'
    },

    isMobileOptions () {
      return this.$q.screen.lt.sm ? 'full-width' : ''
    },

    // CONQUISTAS
    garraAmount () {
      return this.game.items.garra.amount
    },

    garraEfficiency () {
      return this.game.items.garra.value
    },

    aerogelAmount () {
      return this.game.items.aerogel.amount
    },

    cosmicDustAmount () {
      return this.game.cosmicDust
    },

    cosmicDustPerSecond () {
      return this.game.cosmicDustPerSecond
    },

    droneAchiev () {
      return this.game.items.drone.amount
    }

  },

  watch: {
    // recovery (oldValue, newValue) {
    //   console.log(oldValue)
    //   console.log(newValue)
    // },

    animatedNumber (newValue) {
      gsap.to(this.$data, { duration: 0.5, cosmicDustCount: newValue })
    },

    // CONQUISTAS
    garraAmount (newValue) {
      if (newValue === 1 && !this.game.achievementsList.AchivGarra.conquest) {
        this.game.achievementsList.AchivGarra.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.AchivGarra.label)
      }
    },

    garraEfficiency (newValue) {
      if (newValue === 30 && !this.game.achievementsList.achivGarraEfficiency.conquest) {
        this.game.achievementsList.achivGarraEfficiency.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.achivGarraEfficiency.label)
      }
    },

    aerogelAmount (newValue) {
      if (newValue === 20 && !this.game.achievementsList.aerogelAmount.conquest) {
        this.game.achievementsList.aerogelAmount.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.aerogelAmount.label)
      }
    },

    cosmicDustAmount (newValue) {
      if (newValue > 10000 && !this.game.achievementsList.cosmicDust.conquest) {
        this.game.achievementsList.cosmicDust.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.cosmicDust.label)
      }
    },

    cosmicDustPerSecond (newValue) {
      if (newValue > 1000 && !this.game.achievementsList.cosmicDustPerSecond.conquest) {
        this.game.achievementsList.cosmicDustPerSecond.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.cosmicDustPerSecond.label)
      }
    },

    droneAchiev (newValue) {
      if (newValue >= 1 && !this.game.achievementsList.droneAchiev.conquest) {
        this.game.achievementsList.droneAchiev.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.droneAchiev.label)
      }
    }
  },

  methods: {
    gameItemsFilter () {
      const filter = 'type'
      const result = Object.keys(this.game.items).reduce((acc, val) =>
        (this.game.items[val][filter] === 'equipament' ? acc : { ...acc, [val]: this.game.items[val] }), {})
      console.log(result)
      return result
    },

    gameEquipamentsFilter () {
      const filter = 'type'
      const result = Object.keys(this.game.items).reduce((acc, val) =>
        (this.game.items[val][filter] === 'item' ? acc : { ...acc, [val]: this.game.items[val] }), {})
      console.log(result)
      return result
    },

    contactCard () {
      this.contact = true
      this.$refs.buyItem.play()
    },

    audioToggle () {
      if (this.iconAudio === 'volume_off') {
        this.$refs.music.play()

        this.iconAudio = 'volume_up'
      } else {
        this.$refs.music.pause()

        this.iconAudio = 'volume_off'
      }
    },

    recovery () {
      if (this.game.droneFunction.droneSend || !this.game.droneFunction.labelDrone === 'Enviar Drone') { this.droneWorking() }
      return console.log('resume...')
    },

    copy (text) {
      copyToClipboard('far3ll.274@gmail.com')
        .then(() => {
          this.$q.notify({
            message: 'copiado'
          })
        })
        .catch(() => {
          // fail
        })
    },

    achievementSong () {
      const som = new Audio('http://soundimage.org/wp-content/uploads/2016/04/SynthChime2.mp3')
      som.play()
    },

    achievementNotify (text) {
      this.$q.notify({
        message: `Conquista<br><strong>${text}</strong>`,
        multiLine: true,
        html: true,
        timeout: 6000,
        progress: true,
        avatar: 'https://www.flaticon.com/premium-icon/icons/svg/3113/3113054.svg',
        color: 'warning'
      })
    },

    // TODO DRONE ESTÁ RESETANDO QUANDO A PAGINA RECARREGA
    drone () {
      this.game.droneFunction.labelDrone = 'Enviado...'
      this.game.droneFunction.colorDrone = 'bg-blue'
      this.game.droneFunction.droneSend = true
      this.game.cosmicDustPerSecond += this.game.items.drone.launchValue
      this.game.droneFunction.droneTimer = this.game.items.drone.timeLaunch // tempo lançado
      this.game.items.drone.status = 'working'
      const som = new Audio('http://soundimage.org/wp-content/uploads/2016/04/PowerUp28.mp3')
      som.play()

      this.droneWorking()
    },

    droneWorking () {
      if (this.game.items.drone.status === 'working') {
        const timeCont = setInterval(() => {
          this.game.droneFunction.droneTimer -= 1

          if (this.game.droneFunction.droneTimer === 0) {
            clearInterval(timeCont)
            this.game.cosmicDustPerSecond -= this.game.items.drone.launchValue
            this.game.items.drone.status = 'recharging'
            // RECARREGANDO
            this.game.droneFunction.labelDrone = 'Recarregando'
            this.game.droneFunction.colorDrone = 'bg-orange text-bold'
            this.game.droneFunction.droneTimer = this.game.items.drone.bateryRecover // tempo recarregando
            const timerRecharger = setInterval(() => {
              this.game.droneFunction.droneTimer -= 1

              // DISPONIVEL
              if (this.game.droneFunction.droneTimer === 0) {
                clearInterval(timerRecharger)
                this.game.droneFunction.labelDrone = 'Enviar Drone'
                this.game.droneFunction.colorDrone = 'bg-green'
                this.game.droneFunction.droneSend = false
              }
            }, 1000)
          }
        }, 1000)
      }

      if (this.game.items.drone.status === 'recharging') {
        const timerRecharger = setInterval(() => {
          this.game.droneFunction.droneTimer -= 1

          // DISPONIVEL
          if (this.game.droneFunction.droneTimer === 0) {
            clearInterval(timerRecharger)
            this.game.droneFunction.labelDrone = 'Enviar Drone'
            this.game.droneFunction.colorDrone = 'bg-green'
            this.game.droneFunction.droneSend = false
          }
        }, 1000)
      }
    },

    addInstallCountItem (model) {
      this.$q.notify({
        message: '<strong>Upgrade comprado!</strong>',
        multiLine: true,
        html: true,
        timeout: 1000,
        progress: true,
        icon: 'img:https://www.flaticon.com/premium-icon/icons/svg/4680/4680441.svg',
        color: 'blue'
      })
      console.log(this.game.items[model.uplink].ups += 1)
    //   this.game.items[model.uplink].ups += 1
    },

    buyUpgrade (model) {
      this.$refs.buyItem.play()
      switch (model.idu) {
        case 1:
          if (this.game.cosmicDust >= model.price) {
            if (model.label === 'Click Pro') {
              this.game.cosmicDust -= model.price
              this.game.click += model.value

              model.price += model.price * 0.2
              model.value += 0.5

              this.addInstallCountItem(model)
            }
            if (model.label === 'Garra Pro') {
              this.game.cosmicDust -= model.price
              model.price += model.price * 0.2

              this.game.items[model.uplink].value += model.value

              this.addInstallCountItem(model)
            }
          }

          break
        case 2:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price

            this.game.items[model.uplink].value += model.value
            model.price += model.price * 0.2

            this.addInstallCountItem(model)
          }
          break
        case 3:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price

            this.game.items[model.uplink].value += model.value

            model.price += model.price * 0.2

            this.addInstallCountItem(model)
          }
          break
        case 4:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price

            this.game.items[model.uplink].value += model.value

            model.price += model.price * 0.2

            this.addInstallCountItem(model)
          }
          break
        case 5:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price
            if (model.label === 'Drone Pro') {
              this.game.items[model.uplink].value += model.value
              model.price += model.price * 0.2
            }
            if (model.label === 'Drone Sentinela') {
              this.game.items.drone.launchValue += model.value
              model.price += model.price * 0.2
            }
            if (model.label === 'Bateria de Drone') {
              this.game.items.drone.timeLaunch += model.value
              this.game.items.drone.bateryRecover += 1
              model.price += model.price * 0.2
            }
            this.addInstallCountItem(model)
          }
          break
        case 6:
          console.log(model)
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price

            this.game.items[model.uplink].value += model.value

            model.price += model.price * 0.2

            this.addInstallCountItem(model)
          }
          break
      }
    },

    upgrade (model) {
      this.upgradeDialog = true
      this.$refs.buyItem.play()
      this.upgradesList = this.game.upgrades.filter(item => item.idu === model.id)
    },

    toggleDialog () {
      this.$refs.buyItem.play()
      this.dialog = !this.dialog
    },
    achievementsCheck () {
      this.$refs.buyItem.play()
      this.achievements = true
    },

    buyItem (model) {
      if (this.game.cosmicDust >= model.price) {
        this.$refs.buyItem.play()
        this.game.cosmicDust -= model.price // debita o valor
        this.game.cosmicDustPerSecond += model.value // adiciona o multiplicador do item

        model.price += model.price * 0.1
        model.totalEfficiency += model.value

        if (model.amount === 0) {
          this.game.itemsBuyed.push(model)
        }

        model.amount += 1 // adiciona quanditdade de items comprados
        this.game.openShop += +1
        if (model.label === 'drone') {
          this.game.installDrone = true
        }
      }
    },

    open () {
      this.$refs.buyItem.play()
      if (this.game.cosmicDust >= 50) {
        this.game.cosmicDust -= 50
        this.game.openShop = 1
      }
    },

    close () {
      this.saveGame()
      this.game.info = false
    },

    starCompany () {
      this.setName = !this.setName
    },

    getDust () {
      this.game.cosmicDust += this.game.click
    },

    getDustperSecond () {
      setInterval(() => {
        this.game.cosmicDust += this.game.cosmicDustPerSecond
      }, 1000)
    },

    resetGame () {
      localStorage.removeItem(this.version)
      this.$router.go(this.$router.currentRoute)
    },

    saveGame () {
      setInterval(() => {
        const parsed = JSON.stringify(this.game)
        localStorage.setItem(this.version, parsed)
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
@import "node_modules/pixel-borders/src/styles/pixel-borders.scss";

.upgradeDialog {
  background-image: url('https://i.pinimg.com/originals/2d/3c/85/2d3c85f4fae58e749ba5b0d22521fe3d.gif');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 5px;
  min-height: 500px;
  width: 400px;

  &__item {
    background:rgba($color: #fff, $alpha: 0.7);
  }
}

.achive {
  background-image: url('https://i.pinimg.com/564x/b1/bd/c1/b1bdc1ae539dcbd1a7c33cef3e5f2d9a.jpg');
  font-size: 9px;
  width: 100px;
}

.fontSizeText {
  font-size: 8px;
  &__title {
    font-size: 11px;
  }

  &__tabs {
    font-size: 10px;
  }
}

.contact {
  width: 300px;
}

.robot {
  width: 100px;
  height: 130px;
}

.devDialog {
    font-size: 8px;
    text-align: center;
    padding: 5px 3px 5px 3px;
    border-radius: 0.5rem;
    border-style: solid;
    border-color: rgb(0, 0, 0);
    // background: #556779;
}

.page {
  background-image: url(https://i.pinimg.com/564x/b1/bd/c1/b1bdc1ae539dcbd1a7c33cef3e5f2d9a.jpg);
  background-size: unset;
  // background-repeat: space;
  background-color: #2A4158;
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: space-between;
}

.starshipDesktop {
  background-image: url('https://gifimage.net/wp-content/uploads/2018/11/pixel-gif-stars-1.gif');
  width: 400px;
  min-height: 755px;
  background-color: #556779;
  border-radius: 6px;
  border-width: 3px;
  border-style: solid;
  border-color: black;
  // max-height: 800px;

  & + & {
    margin-left: 10px;
  }
}

.starship {
  width: 100%;
  margin: 10px 0 0 0;
  background-image: url('https://gifimage.net/wp-content/uploads/2018/11/pixel-gif-stars-1.gif');
  // background-color: #556779;

  &__item-description {
    text-align: center;
    color: $dark;
    background: #e1e2e4;
    border-radius: 0.5rem;

    &--achivDescrip {
      border-radius: 10px;
      width: 300px;
    }
  }

  &__items {
    img {
      width: 40px;
      height: 40px;
    }
  }

  &__item-list {
    border-radius: 0.5rem;
    border-style: solid;
    border-color: rgb(0, 0, 0);
    background: #556779;
    // overflow: scroll;

    &--achiv {
      border-radius: 10px;
      padding: 2px 2px 2px 2px;
      text-shadow: 2px 2px 2px rgba(0,0,0,0.24);
      // border-top-left-radius: 0.5rem;
      // border-top-right-radius: 0.5rem;
      background: $warning;
    }
  }

  &__item-update {
    // border-radius: 5px;
    background-color: #556779;
  }
}

.not-avaliable {
  position: absolute;
  z-index: 100;
  right: 0px;
  padding: 0 0 20px 0;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: #000000;
}

::-webkit-scrollbar-thumb {

  background: rgb(7, 4, 184);
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(255, 217, 0);
}

</style>
