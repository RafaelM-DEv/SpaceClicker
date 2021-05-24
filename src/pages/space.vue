<template>
  <q-page class="q-pa-sm page font">

    <!-- NOTAS DE UPDATE -->
    <updateNote v-model="game.ShowUpdateNote" :value="game.ShowUpdateNote" @showView="toggleUpdate($event)"/>
    <!-- TODO colocar a logo e badge de desenvolvimento -->
    <!-- TODO remover tag style -->
    <q-page-scroller position="top" :scroll-offset="100" :offset="[18, 18]" style="z-index: 110;">
       <div class="text-white bg-purple q-py-sm q-px-sm text-center text-caption" style="border-radius: 5px;" >
          Poeira Cósmica: {{ cosmicDustCount | formatNumber }}
      </div>
    </q-page-scroller>

      <!-- TODO Remover tag style -->
      <!-- TODO deixar o menu posição fixa -->
    <q-tabs v-model="toolbar" active-color="white" no-caps dense class="bg-blue text-white shadow-2" style="border-radius: 5px;" >
      <!-- <q-badge color="red" floating style="font-size: 8px;">Dev</q-badge> -->
      <q-tab name="space" label="Home" style="width: 100px;"><img src="../assets/ufo.png" alt="" style="width: 30px;"></q-tab>
      <q-tab name="options" label="Opções" style="width: 100px;"><img src="../assets/options.png" style="width: 30px;"></q-tab>
      <q-tab name="achivements" label="Conquistas"><img src="../assets/badge.png" style="width: 30px;"></q-tab>
      <!-- <div><q-btn class="bg-orange-6 q-mr-md q-ml-md" color="white" round :icon="iconAudio" @click="audioToggle"/></div> -->
    </q-tabs>

    <!-- CONQUISTAS -->
    <q-tab-panels v-model="toolbar" animated transition-prev="fade" transition-next="fade" style="background-color:rgba(0, 0, 0, 0.1);">
      <q-tab-panel name="achivements">
        <div class="achive font fit">
          <div class="col text-center text-white text-h6">Conquistas</div>
          <div class="flex justify-center">
            <q-list v-for="(item, index) in game.achievementsList" :key="index" class="starship__item-list text-white starship__item-list--achiv" >
              <div>
                <q-icon v-if="!item.conquest &&  !item.conquestRevel" name="img:https://www.flaticon.com/premium-icon/icons/svg/1321/1321744.svg" size="80px" />
                <q-btn v-if="!item.conquest && !item.conquestRevel" label="revelar" color="purple" class="q-mx-sm" @click="revel = true">
                 <q-dialog v-model="revel">
                  <q-card>
                    <q-card-section class="font" style="font-size: 10px;">
                      <div class="text-center">
                        <img src="../assets/unobtanio.png" alt="" style="width: 30px;">
                      </div>
                      <div>
                        Para revelar essa conquista irá te custar 100x unobtânios
                      </div>
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn label="cancelar" class="font" outline v-close-popup style="font-size: 10px;"/>
                      <q-btn label="prosseguir" class="bg-green font text-white" @click="revelar(item)" style="font-size: 10px;"/>
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                </q-btn>
                <div v-if="item.conquestRevel && !item.conquest" class="q-px-sm starship__item-description starship__item-description--achivDescrip" style="opacity: 0.5;">{{ item.description }}</div>
                <div v-if="item.conquest" class="starship__item-list--achiv">
                  <div class="q-ml-sm q-py-sm text-capitalize text-center">{{ item.label }}</div>
                  <div class="q-px-sm starship__item-description starship__item-description--achivDescrip">{{ item.description }}</div>
                </div>
              </div>
            </q-list>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- MENU DE OPÇÕES -->
    <q-tab-panels v-model="toolbar" animated transition-prev="fade" transition-next="fade" style="background-color:rgba(0, 0, 0, 0.1);">
      <q-tab-panel name="options" >
        <div style="min-width: 100px;" class="flex justify-center  font">
          <q-card-section class="column q-gutter-y-md">
            <!-- TODO criar um modal com uma msg e uma img dizendo que o jogo será resetado e sem tem certeza disso -->
            <div><q-btn label="Reset" @click="resetGame" style="min-width: 200px;" color="negative" /></div>
            <div><q-btn label="contato" class="bg-blue text-white" style="min-width: 200px;" @click="contactCard"/></div>
            <div><q-btn class="bg-orange-6 fit" color="white" label="Nota do Update" @click="toggleUpdate(true)"/></div>
            <div><q-btn class="bg-orange-6 fit" color="white" label="Música" :icon="iconAudio" @click="audioToggle"/></div>
            <!-- TODO criar controle de volume -->
          </q-card-section>
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- STARDUST -->
    <q-tab-panels v-model="toolbar" animated transition-prev="fade" transition-next="fade" style="background-color:rgba(0, 0, 0, 0.1);">
      <q-tab-panel name="space">
        <div class="flex justify-center">
          <div :class="isMobile">
          <q-separator color="red" size="4px" />
          <div style="background-image: url(https://i.pinimg.com/originals/59/31/5f/59315fc4a62dd36b63f40b300ac793b2.gif);">
            <div class="flex justify-center">
              <q-btn outline flat size="15px" :label="game.starCompanyName" @click="starCompany"/>
            </div>
            <div class="column items-center q-mb-md">
              <div class="flex justify-center q-gutter-x-lg">
                <div class="text-center q-mb-md" style="font-size: 12px; ">
                  <q-img src="../assets/cosmic.png" style="width: 65px;" class="q-mb-xs">
                     <q-tooltip content-class="bg-purple font" anchor="top middle" self="center middle" >
                      Poeira Cósmica
                    </q-tooltip>
                  </q-img>
                  <!-- TODO testar responsividade com numeros muito grandes -->
                  <div>{{ cosmicDustCount | formatNumber}}</div>
                </div>
                <div class="text-center" style="font-size: 12px;">
                  <q-img src="../assets/unobtanio.png" style="width: 68px">
                    <q-tooltip content-class="bg-purple font" anchor="top middle" self="center middle">
                      Unobtânio
                    </q-tooltip>
                  </q-img>
                  <div>{{ game.unobtanio }}</div>
                </div>
              </div>
              <div style="font-size: 10px;">Por segundo: {{ game.cosmicDustPerSecond.toFixed(1) }}/s</div>
              <div class="q-mt-sm" style="font-size: 9px;">Ganho por click: {{ game.click }}</div>
            </div>

            <!-- PEGAR POEIRA -->
            <div class="justify-center flex">
              <q-icon v-if="game.droneFunction.droneSend" name="img:https://cdna.artstation.com/p/assets/images/images/025/411/868/original/tomas-sousa-drone1.gif?1585708550" size="50px" style="position: absolute;"/>
              <div v-if="game.cosmicDust === 0" class="text-black q-px-sm" style="position: absolute; font-size: 10px; background-color: white; width: 290px;">Clique na nave para pegar poeira cósmica...</div>
              <q-btn flat round @click="getDust()" size="60px" :ripple="{ color: 'purple' }" color=" q-mb-sm">
                <q-img :src="require('../assets/vehicle.gif')" />
              </q-btn>
            </div>
          </div>
            <q-separator class="" color="orange" size="4px" />
            <!-- INVENTÁRIO -->
            <div class="q-mt-md flex justify-center text-uppercase text-caption">
              <q-tabs v-model="equipamentBay" active-color="white" no-caps dense class="bg-warning text-white shadow-2 fit"  style="border-radius: 5px;" >
                <q-tab name="inventory" label="Inventário"><img src="../assets/inventory.png" style="width: 45px;"></q-tab>
                <q-tab name="missions" label="Misões"><img src="../assets/mission.png" style="width: 35px;"></q-tab>
              </q-tabs>
            </div>

            <q-tab-panels v-model="equipamentBay" animated style="background-color:rgba(0, 0, 0, 0.1);">
              <q-tab-panel name="inventory">
                <!-- DRONE -->
                <div>
                  <div v-if="!game.installDrone" class="text-black q-px-sm q-mt-lg q-mx-sm" style="border-radius: 5px; font-size: 10px; background-color: white;">Compre algum equipamento na loja para ser usado aqui!</div>
                  <div v-if="game.installDrone" class="q-ml-sm q-mt-lg justify-between flex">
                    <q-btn icon="img:https://www.flaticon.com/premium-icon/icons/svg/4014/4014313.svg" :class="game.droneFunction.colorDrone" :label="game.droneFunction.labelDrone" size="12px" :disable="game.droneFunction.droneSend" @click="drone()"/>
                    <q-btn outline :label="game.droneFunction.droneTimer" size="12px"/>
                  </div>
                  <div v-if="game.installDrone" class="q-mt-sm q-mx-sm" style="font-size: 8px;">
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
                </div>
                <!-- CONVERSOR -->
                <div v-if="game.installConversor">
                  <div class="q-ml-sm q-mt-lg justify-between flex">
                    <q-btn class="bg-blue" :disable="game.items.conversor.status === 'working'" style="font-size: 12px;" @click="toConvert()">
                      <q-img class="self-center" :src="require('../assets/converter.png')" style="width: 25px" />
                      <div class="q-mt-xs q-ml-sm">
                        Converter
                      </div>
                    </q-btn>
                    <q-btn outline :label="game.items.conversor.timeLaunch" size="12px"/>
                  </div>
                  <div lass="q-mt-sm q-ml-sm" style="font-size: 8px;">
                    <div class="q-mx-sm q-my-sm">
                    <div class="flex justify-between">
                      <div>Tempo de Processamento</div>
                      <div>{{ game.items.conversor.launchValue }}s</div>
                    </div>
                      Quantidade de Unobitânio
                      <q-input v-model="convertAmount" dark class="text-red shadown-6"  :disable="game.items.conversor.status === 'working'" type="number" dense color="purple" label-color="white" input-class="text-right" reverse-fill-mask fill-mask="0" filled >
                        <template v-slot:prepend>
                          <q-avatar>
                            <img src="../assets/unobtanio.png">
                          </q-avatar>
                        </template>
                      </q-input>
                    </div>
                    <div class="flex justify-end q-mx-sm">
                      <div>
                        <img src="../assets/cosmic.png" style="width: 20px;">
                      </div>
                      <div class="q-ml-sm self-center">
                        1/10.000
                      </div>
                    </div>
                    <!-- <div class="flex justify-between">
                      <div>Capacidade de Coleta do drone</div>
                      <div>{{ game.items.conversor.launchValue }}/s</div>
                    </div> -->
                    <!-- <div class="flex justify-between">
                      <div>Tempo de recarga</div>
                      <div>{{ game.items.conversor.bateryRecover }}s</div>
                    </div> -->
                  </div>
                </div>
              </q-tab-panel>
              <!-- MISSÕES -->
              <q-tab-panel name="missions" style="font-size: 8px;">
                <q-list v-for="(item, index) in game.quest" :key="index">
                  <div class="text-white">
                    <q-img :src="item.img" style="border-radius: 8px; border-color: grey; border-style: solid; height: 120px;" class="q-my-sm" >
                      <div class="absolute-bottom text-caption text-center">{{ item.title }}</div>
                    </q-img>
                    <div class="text-justify text-black q-px-sm" style="border-radius: 5px; background-color: white;">
                      <p>{{ item.description }}</p>
                    </div>

                    <q-separator class="q-mb-sm" color="white" inset size="1px" />

                    <div class="q-mb-sm">
                      <div class="text-center flex justify-center q-gutter-x-lg ">
                        <div>
                          <div>Rendimento</div>
                          <div><q-img src="../assets/unobtanio.png" style="width: 34px"/></div>
                          <div>{{ item.income }} - {{ item.maxIncome }}</div>
                        </div>
                        <div>
                        <div>Custo</div>
                          <div><q-img src="../assets/cosmic.png" style="width: 30px" class="q-mb-xs"/></div>
                          <div>{{ item.dust | formatNumber }} </div>
                        </div>
                      </div>
                    </div>

                    <q-separator class="q-mb-sm" color="white" inset size="1px" />

                    <div class="q-ml-lg text-warning">
                      Itens Necessários:
                    </div>
                    <div class="row">
                      <div class="col bg-black-4 text-capitalize q-pa-xs">
                        <div v-for="(item, index) in item.cost" :key="index">
                          <div class="flex justify-between q-mt-sm">
                            <div>{{ index }}</div>
                            <div v-if="game.items[index].amount >= item">{{ item }}x</div>
                            <div v-else class="text-red" >{{ item }}x</div>
                          </div>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="text-center q-mt-md">
                          <q-circular-progress show-value font-size="12px" :value="item.progressBar" size="80px" :thickness="0.22" color="purple" track-color="grey-3" :max="item.progressBarMax">
                          <q-avatar size="50px">
                            <img src="../assets/unobtanio.png">
                          </q-avatar>
                          </q-circular-progress>
                        </div>
                      </div>
                    </div>
                    <q-btn label="Iniciar" size="13px" push color="warning" class="q-mt-md fit" :disable="item.questStarted" @click="missionStart(item)"/>
                    <q-separator class="q-mt-md" color="warning" size="1px" />
                  </div>
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </div>

          <!-- LISTA DE UPGRADES -->
          <q-dialog v-model="upgradeDialog" :maximized="isMobileMaximized">
            <q-card class="upgradeDialog">
              <q-card-actions class="flex justify-center">
                <div class="fit">
                  <q-btn v-close-popup color="warning" label="fechar" class="fit font" size="12px" />
                </div>
                <div class="text-white bg-purple q-py-xs text-center text-caption fit font" style="border-radius: 5px;"  >
                  Poeira Cósmica: {{ cosmicDustCount | formatNumber }}
                </div>
              </q-card-actions>
              <q-card-section class="q-ma-none q-pa-sm" >
                <q-list v-for="(update, index) in upgradesList" :key="index">
                  <div class="devDialog font pixel-borders--1 q-my-xs upgradeDialog__item">
                    <div class="flex justify-between no-wrap">
                      <div class="column starship__items q-mb-sm q-ml-sm" style="max-width: 80px ">
                        <div>
                          <!-- <img :src="update.img" style="width: 30px; height: 30px;"> -->
                          <q-img :src="require(`../assets/${update.img}`)" style="width: 30px; height: 30px;" />
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
                <q-tab name="itens" label="Gadgets"><img src="" alt=""><img src="../assets/gadget.png" style="width: 30px;"></q-tab>
                <q-tab name="equipamentos" label="Equipamentos"><img src="../assets/telescope.png" style="width: 30px;"></q-tab>
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
                          <q-img :src="require(`../assets/${item.img}`)" style="width: 50px; height: 50px;" />
                        <div class="self-center q-ml-sm text-capitalize">{{ item.label }}</div>
                        </div>
                        <div class="column text-right">
                          <div>
                            Preço: {{ item.price | formatNumber }}
                            <q-img src="../assets/cosmic.png" style="width: 18px" class="q-mb-xs"/>
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
              <!-- EQUIPAMENTOS -->
              <q-tab-panel name="equipamentos">
                <q-list v-if="game.openShop > 0" bordered class="starship__item-list text-white" style="font-size: 8px;">
                  <q-item v-for="(item, key) in gameEquipaments" :key="key" class="starship__items">
                    <q-item-section class="row">
                      <div v-if="game.openShop <= item.unlocked" class="fit dimmed not-avaliable"/>
                      <div class="flex justify-between">
                        <div class="row">
                          <q-img :src="require(`../assets/${item.img}`)" style="width: 40px; height: 40px;" />
                        <div class="self-center q-ml-sm text-capitalize">{{ item.label }}</div>
                        </div>
                        <div class="column text-right">
                          <div>
                            Preço: {{ item.price | formatNumber }}
                            <q-img src="../assets/cosmic.png" style="width: 14px" class="q-mb-xs"/>
                          </div>
                          <div>Eficiência: {{ item.value | formatNumber }}/s</div>
                          <div>Total: {{ item.totalEfficiency | formatNumber }}/s</div>
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
              <q-btn label="" size="10px" color="positive" class="fit"  @click="open">
                  <!-- <q-avatar class="q-ml-sm q-mb-xs self-center" size="20px"><img src="../assets/cosmic.png"></q-avatar> -->
              <div v-if="!game.installDrone" class="text-black q-px-sm  q-mx-sm" style="border-radius: 5px; font-size: 10px; background-color: white;">Clique aqui para liberar a loja! Custo 50 PC<img src="../assets/cosmic.png" style="width: 14px"></div>

              </q-btn>
            </div>
          </div>
       </div>
      </q-tab-panel>
    </q-tab-panels>

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
          <div>
            <div class="text-center text-bold q-mb-sm">Rafael Martins</div>
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
                <div><q-icon name="ion-mail" size="30px" /> Far3ll.274@gmail.com</div>
                <!-- <div><q-btn flat dense size="11px" icon="ion-copy" @click="copy()" /></div> -->
              </div>
              <div class="flex q-mt-md ">
                <q-icon class="q-ml-xs" name="ion-logo-octocat" size="30px" />
                <p class="q-mt-xs q-ml-xs"><a style="text-decoration: none; color: black" href="https://github.com/RafaelM-DEv">https://github.com/RafaelM-DEv</a></p>
              </div>
               <div class="flex q-mt-xs ">
                <q-icon class="q-ml-sm" name="ion-send" size="30px" style="transform: rotate(-20deg)" />
                <p class="q-mt-xs q-ml-xs"><a style="text-decoration: none; color: black" href="https://t.me/joinchat/JmN7LFZEgzlhNDBh">Grupo Space Clicker Oficial</a></p>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="text-primary">
          <q-btn label="ok" v-close-popup color="blue" class="fit" />
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
      <audio ref="convert">
        <source src="../assets/convert.mp3">
      </audio>
    </template>
    <template class="text-center q-mt-sm">
      <audio ref="error">
        <source src="../assets/error.mp3">
      </audio>
    </template>

    <template class="text-center q-mt-sm">
      <audio ref="MissionStartSong">
        <source src="../assets/Mission_start.mp3">
      </audio>
    </template>

    <template class="text-center q-mt-sm">
      <audio ref="MissionComplete">
        <source src="../assets/Mission_complete.mp3">
      </audio>
    </template>

    <template class="text-center q-mt-sm">
      <audio ref="buyItem">
        <source src="../assets/buy.mp3">
      </audio>
    </template>

    <template class="text-center q-mt-sm">
      <audio ref="music" id="bg-audio" autoplay loop>
        <source src="../assets/Checking.mp3">
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
import updateNote from '../components/updateNote.vue'

import gsap from 'gsap'
import { copyToClipboard } from 'quasar'
const numeral = require('numeral')

export default {
  components: { updateNote },

  data () {
    return {
      revel: false,
      convertAmount: 0,
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
      toolbar: 'space',
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
        ShowUpdateNote: true,
        installDrone: false,
        installConversor: false,
        info: true,
        click: 1,
        openShop: 0,
        starCompanyName: 'Nome da Companhia',
        cosmicDust: 0,
        unobtanio: 0,
        cosmicDustPerSecond: 0,
        itemsBuyed: [],
        achievementsList: {
          AchivGarra: {
            id: 1,
            label: 'Meu primeiro item!',
            description: 'Conquistado após comprar o primeiro item.',
            conquest: false,
            conquestRevel: false
          },
          achivGarraEfficiency: {
            id: 2,
            label: 'Mestre da Eficiência!',
            description: 'Garra com 50 de eficiência.',
            conquest: false,
            conquestRevel: false
          },
          aerogelAmount: {
            id: 3,
            label: 'Vai um Aerogel ai?',
            description: 'Conquistado após comprar 100 Aerogel.',
            conquest: false,
            conquestRevel: false
          },
          cosmicDust: {
            id: 4,
            label: '1M de Poeira não é o bastante!',
            description: 'Conquistado após conseguir 1M de poeira cósmica.',
            conquest: false,
            conquestRevel: false
          },
          cosmicDustPerSecond: {
            id: 5,
            label: 'Vamos automatizar Tudo!',
            description: 'Chegou a 1k de Poeira cósmica por segundo',
            conquest: false,
            conquestRevel: false
          },
          droneAchiev: {
            id: 6,
            label: 'Enfim comprei um Drone!',
            description: 'Conquistado após comprar um Drone.',
            conquest: false,
            conquestRevel: false
          },
          convertAchiev: {
            id: 7,
            label: 'Foi uma necessidade!',
            description: 'Conquistado após processar 2 vezes.',
            conquest: false,
            conquestRevel: false
          },
          unobtanioAmount: {
            id: 7,
            label: 'Colecionador de Unobtânio!',
            description: 'Conquistado após conseguir 100 unidades de unobtânio',
            conquest: false,
            conquestRevel: false
          }
        },
        upgrades: [
          {
            idu: 1,
            uplink: 'garra',
            label: 'Click Pro',
            img: 'clicker.png',
            price: 100,
            value: 0.5,
            description: 'Aumenta o ganho do click.'
          },
          {
            idu: 1,
            uplink: 'garra',
            label: 'Garra Pro',
            img: 'garra.png',
            price: 200,
            value: 0.5,
            description: 'Aumenta a eficiência da Garra.'
          },
          {
            idu: 2,
            uplink: 'aerogel',
            label: 'Aerogel Pro',
            img: 'nanocristal.png',
            price: 1000,
            value: 2,
            description: 'Aumenta a eficiência do aerogel em +2'
          },
          {
            idu: 3,
            uplink: 'Processador',
            label: 'Processador Pro',
            img: 'cpu.png',
            price: 3000,
            value: 3,
            description: 'Aumenta a eficiência do processador em +3'
          },
          {
            idu: 4,
            uplink: 'scanner',
            label: 'Scanner',
            img: 'scanner.png',
            price: 5000,
            value: 5,
            description: 'Aumenta a eficiência do scanner em +5'
          },
          {
            idu: 5,
            uplink: 'drone',
            label: 'Drone Pro',
            img: 'drone.png',
            price: 7000,
            value: 5,
            description: 'Aumenta a eficiência do drone em +5'
          },
          {
            idu: 5,
            uplink: 'drone',
            label: 'Drone Sentinela',
            img: 'drone.png',
            price: 8000,
            value: 5,
            description: 'Aumenta a capacidade de coleta do drone lançado em +5'
          },
          {
            idu: 5,
            uplink: 'drone',
            label: 'drone container',
            img: 'drone.png',
            price: 8000,
            value: 5,
            description: 'Aumenta a capacidade de coleta do drone lançado em +5'
          },
          {
            f: 6,
            uplink: 'estação',
            label: 'Bateria de Drone',
            img: 'bateria.png',
            price: 10000,
            value: 2,
            description: 'Aumenta o tempo de coleta do drone lançado em +2 e o tempo de recarga em +1.'
          },
          {
            idu: 7,
            uplink: 'conversor',
            label: 'conversor pro',
            img: 'converter.png',
            price: 10000,
            value: 5,
            description: 'Aumenta a capacidade de reciclagem do conversor em +5'
          }
        ],
        items: {
          garra: {
            id: 1,
            type: 'item',
            label: 'garra',
            img: 'garra.png',
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
            img: 'nanocristal.png',
            description: 'Material usado para ajudar na coleta de poeira cosmica.',
            price: 75,
            value: 2,
            amount: 0,
            unlocked: 2,
            ups: 0,
            totalEfficiency: 0
          },
          Processador: {
            id: 3,
            type: 'item',
            label: 'Processador',
            img: 'cpu.png',
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
            img: 'scanner.png',
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
            img: 'drone.png',
            description: 'Drone pode ser lançado para coletar poeira cósmica.',
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
          estação: {
            id: 6,
            type: 'item',
            label: 'estação',
            img: 'station.png',
            description: 'Usado para lançar um drone e recarregar sua bateria',
            price: 1300,
            value: 8,
            amount: 0,
            unlocked: 10,
            ups: 0,
            totalEfficiency: 0
          },
          conversor: {
            id: 7,
            type: 'equipament',
            label: 'conversor',
            img: 'converter.png',
            description: 'Converte uno (Unobtânio) em PC (Poeira Cósmica). No seu estado "standby" ele consegue retirar PC (Poeira Cósmica) de fragmentos de asteroids.',
            price: 5000,
            value: 10,
            timeLaunch: 0, // tempo de funcionamento
            timesConvert: 0, // não irá usar
            launchValue: 10, // quantidade extraida do unobtânio
            amount: 0,
            unlocked: 30,
            ups: 0,
            totalEfficiency: 0,
            status: 'Pronto' // status do equipamento
          }
        },
        questRecovery: false,
        quest: {
          moon: {
            title: '#1 - Mineração na lua',
            img: 'https://i.pinimg.com/originals/19/d2/28/19d228e7cbd160555af5d92e3154b381.gif',
            description: 'Existem diversos minérios na Lua, mas dentro deles há um muito raro chamado Unobitânio.Crie uma base e comece a minerar para encontrá-los!',
            dust: 200000,
            cost: { // itens amount
              aerogel: 50,
              drone: 10,
              garra: 40,
              Processador: 15,
              scanner: 20,
              estação: 20
            },
            income: 10,
            maxIncome: 20, // unobtânios - numero randon de (30-50)
            workTime: 60000,
            working: 0,
            questStarted: false,
            questNotify: false,
            progressBar: 0,
            progressBarMax: 60
          },
          market: {
            title: '#2 - Mercado espacial',
            img: 'https://i.imgur.com/9oO33CL.gif?noredirect',
            description: 'O Mercado espacial ira vender todo lixo e sucata espacial que você armazena ao longo da jornada. Abra um mercado espacial e ganhe vendendo sucatas!',
            dust: 500000,
            cost: { // itens amount
              aerogel: 80,
              drone: 20,
              garra: 100,
              Processador: 30,
              scanner: 50,
              estação: 50
            },
            income: 20,
            maxIncome: 40, // unobtânios - numero randon de (30-50)
            workTime: 60000,
            working: 0,
            questStarted: false,
            questNotify: false,
            progressBar: 0,
            progressBarMax: 60
          }
        }
      }
    }
  },

  filters: {
    formatNumber: function (value) {
      return numeral(value).format('0,0') // displaying other groupings/separators is possible, look at the docs
    },

    formatNumberDec: function (value) {
      return numeral(value).format('0,0.0') // displaying other groupings/separators is possible, look at the docs
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
    this.isQuestRecovery()
  },

  computed: {
    itemsNeed () {
      return 'text-red'
    },

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
    },

    convertAchiev () {
      return this.game.items.conversor.timesConvert
    },

    unobtanioAmount () {
      return this.game.unobtanio
    }

  },

  watch: {
    animatedNumber (newValue) {
      gsap.to(this.$data, { duration: 0.5, cosmicDustCount: newValue })
    },

    // CONQUISTAS
    unobtanioAmount (newValue) {
      if (newValue === 100 && !this.game.achievementsList.unobtanioAmount.conquest) {
        this.game.achievementsList.unobtanioAmount.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.unobtanioAmount.label)
      }
    },

    convertAchiev (newValue) {
      if (newValue === 1 && !this.game.achievementsList.convertAchiev.conquest) {
        this.game.achievementsList.convertAchiev.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.convertAchiev.label)
      }
    },

    garraAmount (newValue) {
      if (newValue === 1 && !this.game.achievementsList.AchivGarra.conquest) {
        this.game.achievementsList.AchivGarra.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.AchivGarra.label)
      }
    },

    garraEfficiency (newValue) {
      if (newValue === 50 && !this.game.achievementsList.achivGarraEfficiency.conquest) {
        this.game.achievementsList.achivGarraEfficiency.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.achivGarraEfficiency.label)
      }
    },

    aerogelAmount (newValue) {
      if (newValue === 100 && !this.game.achievementsList.aerogelAmount.conquest) {
        this.game.achievementsList.aerogelAmount.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.aerogelAmount.label)
        this.$gtag.event('achievement', { event_category: 'achivement', event_label: 'amount', value: newValue })
      }
    },

    cosmicDustAmount (newValue) {
      if (newValue > 1000000 && !this.game.achievementsList.cosmicDust.conquest) {
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
    revelar (model) {
      if (this.game.unobtanio > 100) {
        this.game.unobtanio -= 100
        this.revel = false
        model.conquestRevel = true
      } else {
        this.$refs.error.play()
        this.$q.notify({
          message: '<span class="font" style="font-size: 8px;">Alerta<br><strong>Não tem unobtânio suficiente</strong></span>',
          multiLine: true,
          html: true,
          timeout: 6000,
          progress: true,
          avatar: require('../assets/unobtanio.png'),
          color: 'negative'
        })
      }
    },

    missionStart (item) {
      let pass = true
      item.progressBar = 0

      if (this.game.cosmicDust >= item.dust) {
        const timer = new Date()
        item.questNotify = false

        Object.entries(item.cost).forEach(([key]) => {
          if (this.game.items[key].amount < item.cost[key]) {
            pass = false
          }
        })

        if (!pass) {
          this.$refs.error.play()
          this.$q.notify({
            message: '<span class="font" style="font-size: 8px;">Relatório de Missão<br><strong>Itens faltando</strong></span>',
            multiLine: true,
            html: true,
            timeout: 6000,
            progress: true,
            avatar: 'https://image.flaticon.com/icons/png/512/455/455875.png',
            color: 'negative'
          })
        } else {
          this.$refs.MissionStartSong.play()
          this.game.cosmicDust -= item.dust
          item.working = timer.getTime() + item.workTime
          item.questStarted = true

          // Contagem do tempo
          const timeCount = setInterval(() => {
            const ocurredTime = new Date().getTime()

            // progress
            item.progressBar += 1

            if (ocurredTime > item.working) {
              clearInterval(timeCount)
              // console.log('recebi a recompensa!')
              item.questStarted = false
              this.$q.notify({
                message: `<span class="font" style="font-size: 8px;">Relatório de Missão<br><strong>Missão ${item.title} bem Sucedida!</strong></span>`,
                multiLine: true,
                html: true,
                timeout: 6000,
                progress: true,
                avatar: 'https://image.flaticon.com/icons/png/512/455/455875.png',
                color: 'gray'
              })
              item.questNotify = true
              item.progressBar = 0
              this.game.unobtanio += Math.floor(Math.random() * (item.maxIncome - item.income) + item.income)
              this.$refs.MissionComplete.play()
            }
          }, 1000)
        }
      } else {
        this.$refs.error.play()
        this.$q.notify({
          message: '<span class="font" style="font-size: 8px;">Relatório de Missão<br><strong>Não há poeira suficientes</strong></span>',
          multiLine: true,
          html: true,
          timeout: 6000,
          progress: true,
          avatar: 'https://image.flaticon.com/icons/png/512/455/455875.png',
          color: 'negative'
        })
      }
    },

    gameItemsFilter () {
      const filter = 'type'
      const result = Object.keys(this.game.items).reduce((acc, val) =>
        (this.game.items[val][filter] === 'equipament' ? acc : { ...acc, [val]: this.game.items[val] }), {})
      // console.log(result)
      return result
    },

    gameEquipamentsFilter () {
      const filter = 'type'
      const result = Object.keys(this.game.items).reduce((acc, val) =>
        (this.game.items[val][filter] === 'item' ? acc : { ...acc, [val]: this.game.items[val] }), {})
      // console.log(result)
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
      // return console.log('resume...')
    },

    isQuestRecovery () {
      Object.entries(this.game.quest).forEach(([key, value]) => {
        if (value.questStarted) {
          const recover = setInterval(() => {
            const timeNow = new Date().getTime()
            value.progressBar += 1

            if (value.working < timeNow) {
              clearInterval(recover)
              Math.floor(Math.random() * (value.maxIncome - value.income) + value.income)
              value.questStarted = false
              value.progressBar = 0
              value.questNotify = true
              this.$refs.MissionComplete.play()
              this.$q.notify({
                message: `<span class="font" style="font-size: 8px;">Relatório de Missão<br><strong>Missão ${value.title} bem Sucedida!</strong></span>`,
                multiLine: true,
                html: true,
                timeout: 6000,
                progress: true,
                avatar: 'https://image.flaticon.com/icons/png/512/455/455875.png',
                color: 'gray'
              })
            }
          }, 1000)
          if (value.questNotify) {
            this.$q.notify({
              message: `<span class="font" style="font-size: 8px;">Relatório de Missão<br><strong>Missão ${value.title} bem Sucedida!</strong></span>`,
              multiLine: true,
              html: true,
              timeout: 6000,
              progress: true,
              avatar: 'https://image.flaticon.com/icons/png/512/455/455875.png',
              color: 'gray'
            })
            value.questNotify = true
          }
        }
      })
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
      this.$gtag.event('achievement', { event_category: 'achivement', event_label: 'amount', value: 1 })
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

    toConvert () {
      let working = this.game.items.conversor.launchValue
      if (this.convertAmount <= this.game.unobtanio && this.convertAmount > 0) {
        this.game.items.conversor.status = 'working'
        this.$refs.convert.play()
        this.game.unobtanio -= this.convertAmount
        const work = setInterval(() => {
          this.game.items.conversor.timeLaunch = working
          working--
          if (working === 0) {
            clearInterval(work)
            this.game.items.conversor.timesConvert += 1
            this.game.items.conversor.status = 'pronto'
            this.game.items.conversor.timeLaunch = 0
            const convertValue = this.convertAmount * 10000
            this.game.cosmicDust += convertValue
            this.$refs.MissionComplete.play()
            this.$q.notify({
              message: `Conversão Completa<br><strong>Foi convertido ${convertValue}</strong>`,
              multiLine: true,
              html: true,
              timeout: 6000,
              progress: true,
              avatar: require('../assets/converter.png'),
              color: 'blue'
            })
          }
        }, 1000)
      } else if (this.convertAmount === 0) {
        this.$refs.error.play()
        this.$q.notify({
          message: 'Atenção<br><strong>Informe uma quantidade a ser convertida</strong>',
          multiLine: true,
          html: true,
          timeout: 6000,
          progress: true,
          avatar: require('../assets/converter.png'),
          color: 'negative'
        })
      } else {
        this.$refs.error.play()
        this.$q.notify({
          message: 'Atenção<br><strong>Não posssui recursos suficientes</strong>',
          multiLine: true,
          html: true,
          timeout: 6000,
          progress: true,
          avatar: require('../assets/converter.png'),
          color: 'negative'
        })
      }
    },

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
      // console.log(this.game.items[model.uplink].ups += 1)
    //   this.game.items[model.uplink].ups += 1
    },

    buyUpgrade (model) {
      this.$refs.buyItem.play()
      switch (model.idu) {
        // garra
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
              model.price += model.price * 0.1

              this.game.items[model.uplink].value += model.value

              this.addInstallCountItem(model)
            }
          }

          break
          // aerogel
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
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price

            this.game.items[model.uplink].value += model.value

            model.price += model.price * 0.2

            this.addInstallCountItem(model)
          }
          break
        case 7:
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

    toggleUpdate (model) {
      this.game.ShowUpdateNote = model
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
        if (model.label === 'conversor') {
          this.game.installConversor = true
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
      this.$gtag.event('click', { event_category: 'click', event_label: 'GetDust', value: 1 })
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
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-position: center;
  // transform: rotate(30deg);
  width: 400px;
  min-height: 755px;
  background-color: #000000;
  border-radius: 4px;
  border-width: 2px;
  border-style: groove;
  border-color: rgba(0, 0, 0, 0.493);
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
  // background-size: cover;
  // background-repeat: no-repeat;
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
