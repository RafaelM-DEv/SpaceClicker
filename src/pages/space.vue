<template>
  <q-page class="q-pa-sm page font">
    <!-- NOTAS DE UPDATE -->
    <updateNote v-model="game.ShowUpdateNote" :value="game.ShowUpdateNote" @showView="toggleUpdate($event)"/>

    <!-- <q-page-scroller position="top" :scroll-offset="100" :offset="[18, 18]" style="z-index: 110;">
      <div class="text-white q-px-xs text-center text-caption border--5 font--8 bg-purple">
        <div>Poeira Cósmica: {{ cosmicDustCount | formatNumber }}</div>
        <div>Unobtainium : {{ game.unobtainium }}</div>
      </div>
    </q-page-scroller> -->
    <!-- TODO reduzir os png ou desenhar no pixel Art -->
    <!-- TODO remover requisião de nave equipada para missões, verificar se foi comprada -->
    <!-- TODO componentizar o game, ver componentes do quasar -->
    <!-- TODO criar seção de piloto -->
    <component :is="menuElementType" elevated >
      <q-tabs v-model="headerToolbar" active-color="white" no-caps dense class="text-white shadow-2">
        <q-tab name="space" label="Home" style="width: 100px;"><img src="../assets/spaceship.png" alt="" style="width: 30px;"></q-tab>
        <q-tab name="options" label="Opções" style="width: 100px;"><img src="../assets/options.png" style="width: 30px;"></q-tab>
        <q-tab name="achivements" label="Conquistas"><img src="../assets/badge.png" style="width: 30px;"></q-tab>
      </q-tabs>
    </component>

    <!-- STARDUST -->
    <q-tab-panels v-model="headerToolbar" animated class="fit starship">
      <q-tab-panel name="space" class="flex justify-center" :class="spaceClicker">
        <div :class="spaceClicker">
          <q-separator color="red" size="4px" />
          <div class="starship--bg">
            <div class="flex justify-center">
              <q-btn push size="15px" :label="game.starCompanyName" @click="setCompanyName"/>
            </div>
            <!-- <q-tabs v-model="main" active-color="white" no-caps dense class="bg-red text-white shadow-2 fit q-mb-md"  style="border-radius: 5px;" >
              <q-tab name="ship" label="Nave"><img src="../assets/spaceship.png" style="width: 30px;"></q-tab>
              <q-tab name="user" label="Piloto"><img src="../assets/capacete-de-astronauta.png" style="width: 30px;"></q-tab>
            </q-tabs> -->
            <!-- MOEDAS -->
            <div class="column items-center q-mb-md">
              <div class="flex q-gutter-x-lg">
                <div class="text-center q-mb-md font--10">
                  <q-img src="../assets/cosmic.png" style="width: 65px;" class="q-mb-xs">
                     <q-tooltip content-class="bg-purple font" anchor="top middle" self="center middle" >
                      Poeira Cósmica
                    </q-tooltip>
                  </q-img>
                  <div>
                    {{ cosmicDustCount | formatNumber}}
                  </div>
                </div>
                <div class="text-center font--10">
                  <q-img src="../assets/unobtainium.png" style="width: 68px">
                    <q-tooltip content-class="bg-purple font" anchor="top middle" self="center middle">
                      Unobtainium
                    </q-tooltip>
                  </q-img>
                  <div>{{ game.unobtainium }}</div>
                </div>
              </div>
              <div class="font--10">Por segundo: {{ game.cosmicDustPerSecond.toFixed(1) }}/s</div>
              <div class="font--10 q-gutter-x-sm">Ganho por click: {{ game.click | formatNumber }}<q-badge class="font--10" color="info">{{game.levelBonus.toFixed(1) }}x</q-badge></div>
              <div class="flex q-gutter-x-sm">
                <q-badge class="font--10 q-mt-sm" color="negative">level: {{ game.level }}</q-badge>
                <q-badge class="font--10 q-mt-sm" color="warning">XP:{{ game.levelUp }}/{{ game.maxlevelUp }}</q-badge>
              </div>
            </div>
            <!-- SHIP/ AÇÃO PEGAR POEIRA  -->
            <div class="justify-center flex">
              <q-icon v-if="game.droneFunction.droneSend" name="img:https://cdna.artstation.com/p/assets/images/images/025/411/868/original/tomas-sousa-drone1.gif?1585708550" size="50px" style="position: absolute;"/>
              <div v-if="game.cosmicDust === 0" class="text-black q-px-sm information shadow-3 text-center" style="z-index: 10;" >Clique na nave para começar a pegar poeira cósmica!</div>
              <q-circular-progress show-value instant-feedback :value="game.levelUp" size="180px" :thickness="0.1" color="warning" track-color="white" :max="game.maxlevelUp" class="q-mb-md">
                <q-btn flat round push @click="getDust()" size="60px" :ripple="{ color: 'yellow-4' }">
                  <q-img :src="require(`../assets/ships/${game.shipEquiped.img}`)" />
                </q-btn>

                  <span id="levelUpEfect" />
                  <span id="float" />
              </q-circular-progress>
            </div>
            <!-- LISTA DE ITENS COMPRADOS -->
            <div class="items-buyed">
              <span v-for="(item, index) in game.itemsBuyed" :key='index' class="items-buyed__list">
                <q-img :src="require(`../assets/${item.img}`)" class="items-buyed__img"/>
                <q-tooltip content-class="bg-purple font font--8" anchor="top middle" self="center middle">
                  <div>Upgrade: +{{ game.items[item.label].ups }}</div>
                  <div>Total de eficiência: {{ game.items[item.label].totalEfficiency | formatNumber}}/s</div>
                </q-tooltip>
              </span>
            </div>
          </div>

          <q-separator class="q-mt-xs" color="orange" size="4px" />
          <!-- INVENTÁRIO / MISSIONS TAB -->
          <div class="border--5" :class="bg">
            <div class="q-mt-sm flex justify-center text-uppercase font--10 shadow-5 border--5">
              <q-tabs v-model="equipamentBay" stretch inline-label active-color="white" no-caps dense class="text-white shadow-2 fit border--5" :class="bg">
                <q-tab name="inventory" label="Inventário" @click="toggleBg('inventory')" ><img src="../assets/inventory.png" style="width: 45px;" class="q-ml-xs"></q-tab>
                <q-tab name="missions" label="Missões" @click="toggleBg('mission')"><img src="../assets/mission.png" style="width: 40px;" class="q-ml-xs"></q-tab>
              </q-tabs>
            </div>

            <q-tab-panels v-model="equipamentBay" animated class="transparent">
              <!-- INVENTÁRIO -->
              <q-tab-panel name="inventory">
                <!-- DRONE -->
                <div v-if="!game.installDrone && !game.installConversor" class="text-black q-pa-sm q-ma-sm font--10 border--5 bg-white shadow-2 text-center">Compre algum equipamento na loja para ser usado aqui!</div>
                <div v-if="game.installDrone" class="q-mx-sm q-mt-lg justify-between flex">
                  <q-btn :class="game.droneFunction.colorDrone" push class="fit" size="12px" :disable="game.droneFunction.droneSend" @click="drone()">
                    <div class="row no-wrap q-gutter-x-lg q-my-sm">
                      <q-circular-progress show-value font-size="12px" :value="game.droneFunction.droneTimer" size="80px" :thickness="0.22" color="purple" track-color="grey-3" :max="game.droneFunction.droneMaxTime" class="q-ml-sm">
                        <q-avatar size="50px"><img src="../assets/drone.png"></q-avatar>
                      </q-circular-progress>
                      <div class="font--10 self-center">{{ game.droneFunction.labelDrone }}</div>
                    </div>
                  </q-btn>
                </div>
                <div v-if="game.installDrone" class="q-my-sm q-mx-sm bg-white border--5 text-black font--8 q-pa-xs shadow-1">
                  <div class="flex justify-between">
                    <div>Capacidade de Coleta do drone</div>
                    <div>{{ game.items.drone.launchValue | formatNumber}}/s</div>
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
                <q-separator v-if="game.installDrone && game.installConversor" class="q-my-sm shadow-1" color="white" inset size="1px" />
                <!-- CONVERSOR -->
                <div v-if="game.installConversor">
                  <div class="q-mx-sm justify-between flex">
                    <q-btn class="bg-blue font--10 fit" push :disable="game.items.conversor.status === 'working'" @click="toConvert()">
                      <div class="row no-wrap q-gutter-x-lg q-my-sm">
                        <q-circular-progress show-value font-size="12px" :value="game.items.conversor.timeLaunch" size="80px" :thickness="0.22" color="purple" track-color="grey-3" :max="this.game.items.conversor.launchValue" class="q-ml-sm">
                          <q-avatar size="50px"><img src="../assets/converter.png"></q-avatar>
                        </q-circular-progress>
                        <div class="font--10 self-center" >Converter</div>
                      </div>
                    </q-btn>
                  </div>
                  <div lass="q-mt-sm q-ml-sm">
                    <div class="q-mx-sm q-my-sm">
                      <div class="flex justify-between q-mb-sm bg-white border--5 text-black font--8 q-pa-xs shadow-1">
                        <div>Tempo de Processamento</div>
                        <div>{{ game.items.conversor.launchValue }}s</div>
                      </div>
                      <q-input v-model.number="convertAmount" filled standout="bg-purple text-white" label="Qtd. Unobtainium" type="number" color="purple" label-color="white" input-class="text-right text-white" reverse-fill-mask :disable="game.items.conversor.status === 'working'" >
                        <template v-slot:before>
                          <q-avatar><img src="../assets/unobtainium.png"></q-avatar>
                        </template>
                      </q-input>
                    </div>
                    <div class="flex justify-end q-mx-sm font--8">
                      <div class="q-ml-sm flex items-center">
                        <div class="q-mr-xs">Total: {{ qtdDustConvert | formatNumber }}</div>
                        <div><img src="../assets/cosmic.png" style="width: 20px;"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <q-separator  v-if="game.installDrone && game.installConversor" class="q-my-sm shadow-1" color="white" inset size="1px" />
              </q-tab-panel>
              <!-- MISSÕES -->
              <q-tab-panel name="missions" >
              <q-pagination v-model="pageQuest" :max="4"  push color="warning" class="flex justify-center q-mt-sm" @click="changePage(pageQuest)" />
                <div class="font--8 q-mb-xs text-white">
                  <q-list v-for="(item, index) in game.quest" :key="index" >
                    <div v-if="item.qId === pageQuest" class="q-mx-sm">
                      <q-img ref="Mission" :src="require(`../assets/${item.img}`)" class="q-my-sm border--5 shadow-2" style="border-color: white; border-style: solid; height: 120px;">
                        <div class="absolute-bottom text-caption text-center">{{ item.title }}</div>
                      </q-img>
                      <div class="text-justify text-black q-px-sm shadow-1" style="border-radius: 5px; background-color: white;">
                        <p>{{ item.description }}</p>
                      </div>
                      <q-separator class="q-mb-sm shadow-1" color="white" inset size="1px" />
                      <div class="q-mb-sm">
                        <div class="text-center flex justify-center q-gutter-x-lg">
                          <div>
                            <div>Nave Necessária equipada</div>
                            <div><q-img :src="require(`../assets/ships/${item.shipRequire.img}`)" style="width: 94px"/></div>
                            <div v-if="game.shipEquiped.id === item.shipRequire.id">{{ item.shipRequire.label }} equipada</div>
                            <div v-else class="text-red" >{{ item.shipRequire.label }} não equipada</div>
                          </div>
                        </div>
                      </div>
                      <q-separator class="q-mb-sm shadow-1" color="white" inset size="1px" />
                      <div class="q-mb-sm">
                        <div class="text-center flex justify-center q-gutter-x-lg">
                          <div>
                            <div>Rendimento</div>
                            <div><q-img src="../assets/unobtainium.png" style="width: 34px"/></div>
                            <div>{{ item.income }} - {{ item.maxIncome }}</div>
                          </div>
                          <div>
                            <div>Custo</div>
                            <div><q-img src="../assets/cosmic.png" style="width: 30px" class="q-mb-xs"/></div>
                            <div>{{ item.dust | formatNumber }} </div>
                          </div>
                        </div>
                      </div>
                      <q-separator class="q-mb-sm shadow-1" color="white" inset size="1px" />
                      <div>Itens Necessários:</div>
                      <div class="row">
                        <div class="col text-capitalize q-pa-xs bg-white text-black border--5 shadow-1">
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
                            <q-circular-progress show-value class="shadow-2" style="border-radius: 3rem;" font-size="12px" :value="item.progressBar" size="80px" :thickness="0.22" color="purple" track-color="grey-3" :max="item.progressBarMax">
                              <q-tooltip content-class="bg-purple font" anchor="top middle" self="center middle" >
                                Tempo: {{ item.progressBar }}seg.
                                Total: {{ item.progressBarMax }}seg.
                              </q-tooltip>
                              <q-avatar size="50px">
                                <img src="../assets/unobtainium.png">
                              </q-avatar>
                            </q-circular-progress>
                          </div>
                        </div>
                      </div>
                      <q-btn label="Iniciar" size="13px" push color="warning" class="q-mt-md fit" :disable="item.questStarted" @click="missionStart(item)"/>
                      <q-separator class="q-mt-md" color="white" size="1px" />
                    </div>
                  </q-list>
                  <!-- TODO implementar som ao clicar -->
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
        <!-- LISTA DE UPGRADES -->
        <q-dialog v-model="upgradeDialog" :maximized="modeMobile">
          <q-card class="upgradeDialog font text-center">
            <q-card-actions class="flex justify-center">
              <div class="fit">
                  <q-btn v-close-popup color="warning" label="fechar" push class="fit font shadow-2" size="12px" />
              </div>
              <div class="text-white shadow-5 bg-purple q-py-xs text-center text-caption fit font" style="border-radius: 5px;"  >
                Poeira Cósmica: {{ cosmicDustCount | formatNumber }}
              </div>
            </q-card-actions>
            <!-- Upgrades -->
            <q-card-section class="q-ma-none q-pa-sm" >
              <q-list v-for="(upgrade, index) in upgradesList" :key="index">
                <div class="font--8 q-my-xs q-pa-sm upgradeDialog__item border--5 shadow-3">
                  <div class="flex justify-between no-wrap">
                    <div class="column q-mb-sm q-ml-sm" style="max-width: 80px ">
                      <div><q-img :src="require(`../assets/${upgrade.img}`)" style="width: 30px; height: 30px;" /></div>
                      <div class="text-capitalize" style="font-size: 8px;">{{ upgrade.label }}</div>
                    </div>
                    <div class="column text-right q-mt-md">
                      <div>
                        Preço: {{  upgrade.price | formatNumber }}
                        <q-tooltip content-class="bg-purple font font--8" anchor="top middle" self="center middle" >
                          Total Gasto: {{ upgrade.totalSpent | formatNumber }}
                          <q-img src="../assets/cosmic.png" style="width: 15px" class="q-mb-xs"/>
                          <div>Preço * 0.2</div>
                          <div>Qtd.: +{{game.items[upgrade.uplink].ups}}</div>
                        </q-tooltip>
                        <q-img src="../assets/cosmic.png" style="width: 15px" class="q-mb-xs"/>
                      </div>
                      <!-- TODO Remover lógica da view -->
                      <div>
                        <div v-if="upgrade.idu !== 5 && upgrade.value !== 0">Eficiência: +{{ upgrade.value | formatNumberDec }}</div>
                        <div v-if="upgrade.label === 'Drone Pro'">Eficiência: +{{ upgrade.value | formatNumber }}</div>
                        <div v-if="upgrade.label === 'Drone Pro' || upgrade.idu !== 5 && upgrade.value !== 0">(+0.2 por upgrade)</div>
                      </div>
                      <!-- DRONE -->
                      <div v-if="upgrade.label === 'Drone Sentinela'" >Coleta de Poeira: +{{ upgrade.value | formatNumber }}</div>
                      <div v-if="upgrade.label === 'Bateria de Drone'" >Coleta: +2s</div>
                      <div v-if="upgrade.label === 'Bateria de Drone'" >Recarga: +1s</div>
                    </div>
                  </div>
                  <div class="q-px-md q-mt-sm bg-white border--5 font--8">{{ upgrade.description }}</div>
                  <q-btn label="comprar" size="15px" push color="blue" :disable="game.cosmicDust < upgrade.price" class="q-mt-md fit" @click="buyUpgrade(upgrade)" />
                </div>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>
        <!-- ITENS -->
        <div :class="spaceClicker" class="starship__items" >
          <q-separator v-if="game.openShop !== 0" color="green" size="4px" />
          <div v-if="game.openShop !== 0" class="q-my-md flex justify-center text-uppercase">
            <div class="q-mb-sm">Loja Espacial</div>
            <q-tabs v-model="shop" active-color="white" no-caps dense class="bg-green text-white shadow-2 fit"  style="border-radius: 5px;" >
              <q-tab name="itens" label="Gadgets"><img src="../assets/gadget.png" style="width: 30px;"></q-tab>
              <q-tab name="equipamentos" label="Equipamentos"><img src="../assets/telescope.png" style="width: 30px;"></q-tab>
              <q-tab name="ships" label="Naves"><img src="../assets/ships/vehicle.gif" style="width: 55px;"></q-tab>
            </q-tabs>
          </div>
          <q-tab-panels v-if="game.openShop > 0" v-model="shop" animated class="starship__items">
            <q-tab-panel name="itens" class="q-gutter-md " style="min-height: 500px;">
            <q-pagination v-model="pageItems" :max="3"  push color="warning" class="flex justify-center" @click="changePage(pageItems)"/>
              <q-list v-for="(item, key) in gameItems" :key="key" class="text-white font--8">
                <q-item-section ref="item" v-if="item.page === pageItems" class="row justify-center align-center q-ml-sm">
                  <div class="flex justify-between">
                    <div class="row items-center">
                      <q-img :src="require(`../assets/${item.img}`)" style="width: 40px; height: 40px;" />
                      <div class="self-center q-ml-sm text-capitalize">{{ item.label }}</div>
                    </div>
                    <div class="column text-right q-mb-sm">
                      <div>
                        Preço: {{ item.price | formatNumber }}
                        <q-img src="../assets/cosmic.png" style="width: 18px" class="q-mb-xs"/>
                      </div>
                      <div>Eficiência: {{ item.value | formatNumberDec }}/s</div>
                      <div>Total: {{ item.totalEfficiency.toFixed(1) }}/s</div>
                      <div class="self-end q-mb-xs">{{ item.amount | formatNumber }} unidades</div>
                    </div>
                  </div>
                  <div class="q-px-md bg-white border--5 text-black text-center q-py-xs">{{ item.description }}</div>
                  <div v-if="game.openShop <= item.unlocked" class="q-px-md bg-warning border--5 text-black text-center q-py-xs q-mt-sm">desbloqueio: {{ item.unlocked }} items </div>
                  <q-btn v-if="game.openShop >= item.unlocked" label="comprar" size="13px" push color="green" :disable="game.cosmicDust < item.price" class="q-mt-md" @click="buyItem(item)" />
                  <q-btn v-if="game.openShop >= item.unlocked" label="upgrade" size="13px" push color="blue" :disable="item.amount === 0" class="q-mt-md" @click="upgrade(item)" />
                <q-separator color="green" size="1px" class="q-mt-md" />
                </q-item-section>
              </q-list>
            </q-tab-panel>
            <!-- Equipamentos -->
            <q-tab-panel name="equipamentos">
              <q-list v-if="game.openShop > 0" bordered class="text-white font--8 starship__items">
                <q-item v-for="(item, key) in gameEquipaments" :key="key">
                  <q-item-section class="row">
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
                    <div class="self-end q-mb-xs">{{ item.amount | formatNumber }} unidades</div>
                    <div class="q-px-md bg-white border--5 text-black text-center q-py-xs">{{ item.description }}</div>
                    <div v-if="game.openShop <= item.unlocked" class="q-px-md bg-warning border--5 text-black text-center q-py-xs q-mt-sm">desbloqueio: {{ item.unlocked }} items </div>
                    <q-btn v-if="game.openShop >= item.unlocked" label="comprar" size="13px" push color="green" :disable="game.cosmicDust < item.price" class="q-mt-md" @click="buyItem(item)" />
                    <q-btn v-if="game.openShop >= item.unlocked" label="upgrade" size="13px" push color="blue" :disable="item.amount === 0" class="q-mt-md" @click="upgrade(item)" />
                  <q-separator color="black" size="1px" class="q-mt-md" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
            <!-- ships -->
            <q-tab-panel v-if="game.openShop > 0" name="ships">
              <q-pagination v-model="pageShips" :max="4" push color="warning" class="flex justify-center" @click="changePage(pageShips)" />
              <q-list v-for="(item, key) in game.ship" :key="key" bordered class="text-white font--8 starship__items">
                <q-item-section v-if="item.page === pageShips" class="row starship__items">
                  <div class="column">
                    <div class="flex justify-center bg-warning border--5 q-mt-sm q-px-sm shadow-2">
                      <div class="fit justify-center flex">
                        <q-img :src="require(`../assets/ships/${item.img}`)" style="width: 128px; height: 80px;" />
                      </div>
                      <div class="fit justify-center flex q-mb-sm text-capitalize">{{ item.label }}</div>
                      <div class="fit justify-center flex">
                        <q-btn label="Equipar Nave" size="13px" push color="blue" :disable="checkParts(item)" @click="equipShip(item)" />
                          <q-btn icon="close" size="13px" push color="red" class="q-ml-xs" :disable="checkParts(item)" @click="unquipShip(item)" />
                      </div>
                      <div class="q-px-md bg-white border--5 text-black text-center q-py-xs q-mx-md q-my-sm shadow-1">{{ item.description }}</div>
                    </div>
                    <!-- PARTS -->
                    <q-separator color="white" size="1px" class="q-my-sm" />
                    <div class="text-center q-mb-xs">PARTES</div>
                  </div>
                    <q-item v-for="(parts, key) in game.ship[key].parts" :key="key" class="bg-blue border--5 q-mb-xs">
                      <div class="flex">
                        <q-img :src="require(`../assets/ships/${parts.img}`)" style="width: 50px; height: 50px; border-radius: 1rem; border-color: white; border-style: solid; border-width: 2px;" />
                      </div>
                      <div class="column text-center justify-center col text-capitalize">
                        <div>{{ parts.label }}</div>
                        <div>
                          preço: {{ parts.price | formatNumber }}
                          <q-img v-if="item.id === 1" src="../assets/cosmic.png" style="width: 18px" class="q-mb-xs q-ml-xs"/>
                          <q-img v-else src="../assets/unobtainium.png" style="width: 18px" class="q-mb-xs q-ml-xs"/>
                        </div>
                      </div>
                      <div>
                        <q-btn :label="shipPartCheck(parts, 'label')" size="10px" push dense :color="shipPartCheck(parts, 'color')" :disable="parts.buyed" class="fit" @click="buyPart(parts, item)" />
                      </div>
                    </q-item>
                <q-separator color="black" size="1px" class="q-mt-md" />
                </q-item-section>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
          <!-- INVENTÁRIO INFO -->
          <div v-if="game.openShop === 0" class="flex fit">
            <q-btn label="" size="10px" color="positive" class="fit" @click="open">
              <div v-if="!game.installDrone" class="text-black q-py-sm border--5 bg-white font--10 shadow-2">Clique aqui para liberar a loja! Custo 50 PC<img src="../assets/cosmic.png" style="width: 14px"></div>
            </q-btn>
          </div>
        </div>
      </q-tab-panel>
      <!-- MENU DE OPÇÕES -->
      <q-tab-panel name="options" >
        <div style="min-width: 100px;" class="flex justify-center  font">
          <q-card-section class="column q-gutter-y-md">
            <!-- TODO criar um modal com uma msg e uma img dizendo que o jogo será resetado e sem tem certeza disso -->
            <div><q-btn label="contato" class="bg-blue text-white" style="min-width: 250px;" @click="contactCard"/></div>
            <div><q-btn label="Nota do Update" class="bg-green-6 fit" color="white"  style="max-width: 250px;" @click="toggleUpdate(true)"/></div>
            <div><q-btn label="Musica" class="bg-orange-6 fit column" color="white" :icon="iconAudio" @click="audioToggle"/></div>
            <div>
              <q-btn class="bg-orange-6 fit column" color="white" label="Volume">
                <q-slider v-model="musicVolume" :min="0.0" :max="1" :step="0.1" @input="setVolume(musicVolume)" label :label-value="'volume ' + musicVolume" color="blue"/>
              </q-btn>
            </div>
            <div><q-btn label="Reset" @click="resetGame" style="min-width: 250px;" color="negative" /></div>
            <div><q-btn label="Save Game" @click="saveGameForced" style="min-width: 250px;" color="positive" /></div>
            <div>
              <q-btn label="Sair" @click="logout" :loading="exit" style="min-width: 250px;" color="warning">
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </div>
            <q-badge color="black" class="text-white font--8" :label="'Version:'+ version" />
            <q-badge color="black" class="text-white font--8" :label="'Salvo:'+saveStatus" />
          </q-card-section>
        </div>
      </q-tab-panel>
      <!-- CONQUISTAS -->
      <q-tab-panel name="achivements">
          <div class="col text-center text-white text-h6">Conquistas</div>
          <div class="flex justify-center">
            <q-list v-for="(item, index) in game.achievementsList" :key="index" class="achivements__item-list text-white font--8 q-ma-xs" >
              <div class="flex">
                <img v-if="!item.conquest &&  !item.conquestRevel" src="../assets/interrogation.png" class="q-mt-xs" />
                <!-- <q-btn v-if="!item.conquest && !item.conquestRevel" label="revelar" class="q-mx-sm" flat @click="toRevealToggle" /> -->
                 <!-- <q-dialog v-model="toReveal">
                    <q-card class="font">
                      <q-card-section class="font--8 text-center">
                        <div><img src="../assets/unobtainium.png" style="width: 30px;"></div>
                        <div>Para revelar essa conquista irá te custar 100x unobtainium.</div>
                      </q-card-section>
                      <q-card-actions align="right">
                        <q-btn label="cancelar" class="font--8" outline v-close-popup />
                        <q-btn label="prosseguir" class="bg-green font--8 text-white" @click="revelar(item)"/>
                      </q-card-actions>
                    </q-card>
                  </q-dialog> -->
                <div v-if="item.conquestRevel && !item.conquest" class="q-px-sm achivements__item-list__description" style="opacity: 0.5;">{{ item.description }}</div>
                <div v-if="item.conquest" class="achivements__item-list">
                  <div class="q-ml-sm q-py-sm text-capitalize text-center">{{ item.label }}</div>
                  <div class="q-ma-xs q-px-xs text-black text-center bg-white achivements__item-list">{{ item.description }}</div>
                </div>
              </div>
            </q-list>
          </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- NOME DA COMPANHIA -->
    <q-dialog v-model="setName" persistent>
        <q-card class="font company text-white">
          <q-card-section class="bg-warning">
            <span class="font--8 q-ml-xs" >Nome da Companhia:</span>
            <q-input v-model="game.starCompanyName" class="font--8" dark @focus="game.starCompanyName = '' " outlined :rules="[val => !!val || 'Eii precisamos de um nome!!!']" color="white"/>
          </q-card-section>
         <q-card-actions align="right" class="text-primary">
          <q-btn label="ok" color="blue" v-close-popup :disable="game.starCompanyName === '' "/>
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
      <audio ref="music" id="bg-audio" loop>
        <source src="../assets/Checking.mp3">
      </audio>
    </template>
  </q-page>
</template>

<script>
import updateNote from '../components/updateNote.vue'
import { date, copyToClipboard } from 'quasar'
import gsap from 'gsap'

import firebase from 'firebase/app'
import { mapActions } from 'vuex'

export default {
  components: { updateNote },

  data () {
    return {
      main: 'ship',
      shipsControl: {
        partBtn: {
          color: 'green',
          label: 'comprar'
        }
      },
      achievements: false,
      asteroidDialog: false,
      bg: 'bg-warning',
      contact: false,
      convertAmount: 0,
      cosmicDustCount: 0,
      equipamentBay: 'inventory',
      exit: false,
      headerToolbar: 'space',
      iconAudio: 'volume_up',
      musicVolume: 0.2,
      oldVersion: '1.2.5',
      pageItems: 1,
      pageQuest: 1,
      pageShips: 1,
      saveStatus: '--/--/--',
      setName: false,
      shop: 'itens',
      toReveal: false,
      upgradeDialog: false,
      upgradesList: [],
      version: '1.2.6',
      volume: 1,
      game: {
        shipEquiped: {
          id: 0,
          img: 'vehicle.gif'
        },
        levelUp: 0,
        maxlevelUp: 100,
        level: 1,
        starCompanyName: 'Nome da Companhia',
        openShop: 0,
        cosmicDust: 10000000,
        unobtainium: 100,
        cosmicDustPerSecond: 0,
        upgrades: [
          {
            idu: 1,
            uplink: 'garra',
            label: 'Click Pro',
            img: 'clicker.png',
            price: 100,
            totalSpent: 0,
            value: 0.5,
            description: 'Aumenta o ganho do click.'
          },
          {
            idu: 1,
            uplink: 'garra',
            label: 'Garra Pro',
            img: 'garra.png',
            price: 200,
            totalSpent: 0,
            value: 0.5,
            description: 'Aumenta a eficiência da Garra.'
          },
          {
            idu: 2,
            uplink: 'aerogel',
            label: 'Aerogel Pro',
            img: 'nanocristal.png',
            price: 1000,
            totalSpent: 0,
            value: 2,
            description: 'Aumenta a eficiência do aerogel. Bônus upgrade 10/20/30.'
          },
          {
            idu: 3,
            uplink: 'Processador',
            label: 'Processador Pro',
            img: 'cpu.png',
            price: 3000,
            totalSpent: 0,
            value: 3,
            description: 'Aumenta a eficiência do processador.'
          },
          {
            idu: 4,
            uplink: 'escâner',
            label: 'escâner',
            img: 'scanner.png',
            price: 5000,
            totalSpent: 0,
            value: 5,
            description: 'Aumenta a eficiência do escâner.'
          },
          {
            idu: 5,
            uplink: 'drone',
            label: 'Drone Pro',
            img: 'drone.png',
            price: 7000,
            totalSpent: 0,
            value: 7,
            description: 'Aumenta a eficiência do drone'
          },
          {
            idu: 5,
            uplink: 'drone',
            label: 'Drone Sentinela',
            img: 'drone.png',
            price: 80,
            totalSpent: 0,
            value: 8,
            description: 'Aumenta a capacidade de coleta do drone lançado em +8'
          },
          {
            idu: 5,
            uplink: 'drone',
            label: 'Bateria de Drone',
            img: 'bateria.png',
            price: 1000,
            totalSpent: 0,
            value: 8,
            description: 'Aumenta o tempo de coleta do drone lançado em +2 e o tempo de recarga em +1.'
          },
          {
            idu: 6,
            uplink: 'estação',
            label: 'Estação pro',
            img: 'station.png',
            price: 10000,
            totalSpent: 0,
            value: 10,
            description: 'Aumenta a eficiência da estação.'
          },
          {
            idu: 7,
            uplink: 'conversor',
            label: 'conversor pro',
            img: 'converter.png',
            price: 15000,
            totalSpent: 0,
            value: 10,
            description: 'Aumenta a capacidade de reciclagem do conversor.'
          },
          {
            idu: 7,
            uplink: 'conversor',
            label: 'Conversor Diamante',
            img: 'converter.png',
            price: 150000,
            totalSpent: 0,
            value: 0,
            description: 'Aumenta o multiplicador do conversor em + 5k e o tempo em +20s'
          }
        ],
        achievementsList: {
          garraAchiv: {
            id: 1,
            label: 'Meu primeiro item!',
            description: 'Conquistado após comprar o primeiro item.',
            conquest: false,
            conquestRevel: false
          },
          garraAchivTwo: {
            id: 1,
            label: 'Gostei desse item Garra!',
            description: 'Conquistado após comprar 50 unidades de garra!',
            conquest: false,
            conquestRevel: false
          },
          garraAchivThree: {
            id: 1,
            label: 'Quanto mais garra melhor!',
            description: 'Conquistado após comprar 100 unidades de garra!',
            conquest: false,
            conquestRevel: false
          },
          garraEfficiencyAchiv: {
            id: 2,
            label: 'Mestre da Eficiência!',
            description: 'Garra com 50+ de eficiência.',
            conquest: false,
            conquestRevel: false
          },
          garraEfficiencyAchivTwo: {
            id: 2,
            label: 'Mestre da Eficiência 2!',
            description: 'Garra com 150+ de eficiência.',
            conquest: false,
            conquestRevel: false
          },
          garraEfficiencyAchivThree: {
            id: 2,
            label: 'Mestre da Eficiência 3!',
            description: 'Garra com 250+ de eficiência.',
            conquest: false,
            conquestRevel: false
          },
          aerogelAmountAchiv: {
            id: 3,
            label: 'Vai um Aerogel ai?',
            description: 'Conquistado após comprar 100 Aerogel.',
            conquest: false,
            conquestRevel: false
          },
          aerogelAmountAchivTwo: {
            id: 3,
            label: 'Preciso de mais disso!',
            description: 'Conquistado após comprar 200 Aerogel.',
            conquest: false,
            conquestRevel: false
          },
          cosmicDustAchiv: {
            id: 4,
            label: '1m de Poeira não é o bastante!',
            description: 'Conquistado após conseguir 1M de poeira cósmica.',
            conquest: false,
            conquestRevel: false
          },
          cosmicDustAchivTwo: {
            id: 4,
            label: '1b Uau Tudo isso?!',
            description: 'Conquistado após conseguir 1b de poeira cósmica.',
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
          droneAchiv: {
            id: 6,
            label: 'Enfim comprei um Drone!',
            description: 'Conquistado após comprar um Drone.',
            conquest: false,
            conquestRevel: false
          },
          droneAchivTwo: {
            id: 6,
            label: 'Melhorei meu Drone!',
            description: 'Conquistado após comprar um Drone.',
            conquest: false,
            conquestRevel: false
          },
          droneAchivThree: {
            id: 6,
            label: 'Um Exército de Drones!',
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
          convertAchievTwo: {
            id: 7,
            label: 'Vamos Melhorar isso!',
            description: 'Conquistado após Melhorar o Conversor.',
            conquest: false,
            conquestRevel: false
          },
          unobtainiumAmount: {
            id: 7,
            label: 'Colecionador de unobtainium!',
            description: 'Conquistado após conseguir 100 unidades de unobtainium',
            conquest: false,
            conquestRevel: false
          },
          shipAchiv: {
            id: 1,
            label: 'Equipei uma Nave Nova!',
            description: 'Conquistado após Equipar a primeira nave!',
            conquest: false,
            conquestRevel: false
          },
          shipAchivTwo: {
            id: 1,
            label: 'Equipei a Reliant',
            description: 'Conquistado após Equipar Reliant!',
            conquest: false,
            conquestRevel: false
          },
          missionAchiv: {
            id: 1,
            label: 'Missão Iniciada!',
            description: 'Conquistado após iniciar uma Missão!',
            conquest: false,
            conquestRevel: false
          }
        },
        // -----------
        levelBonus: 1,
        droneFunction: {
          droneTimer: 0,
          droneMaxTime: 0,
          labelDrone: 'Enviar Drone',
          colorDrone: 'bg-green',
          droneSend: false
        },
        ShowUpdateNote: false,
        installDrone: false,
        installConversor: false,
        info: true,
        click: 1,
        itemsBuyed: [],
        items: {
          garra: {
            id: 1,
            page: 1,
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
            page: 1,
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
            page: 2,
            type: 'item',
            label: 'Processador',
            img: 'cpu.png',
            description: 'Material usado para aumentar a capacidade de processamento de dados.',
            price: 1150,
            value: 5,
            amount: 0,
            unlocked: 4,
            ups: 0,
            totalEfficiency: 0
          },
          escâner: {
            id: 4,
            page: 2,
            type: 'item',
            label: 'escâner',
            img: 'scanner.png',
            description: 'Material usado para escanear asteroides.',
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
            page: 3,
            type: 'item',
            label: 'estação',
            img: 'station.png',
            description: 'Melhora a comunicação da Nave.',
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
            description: 'Converte uno (unobtainium) em PC (Poeira Cósmica). No seu estado "standby" ele consegue retirar PC de fragmentos de asteroids.',
            price: 5000,
            value: 10,
            timeLaunch: 0, // tempo de funcionamento
            timesConvert: 0, // não irá usar
            launchValue: 10, // quantidade extraida do unobtainium
            amount: 0,
            unlocked: 30,
            ups: 0,
            multiply: 10000,
            totalEfficiency: 0,
            status: 'Pronto' // status do equipamento
          }
        },
        ship: {
          ship1: {
            id: 1,
            page: 1,
            label: 'Tundra',
            img: 'Ship1/Ship1.png',
            shipLocked: false,
            description: 'nave desenvolvida para mineração.',
            parts: {
              body: {
                label: 'Corpo',
                price: 30000,
                buyed: false,
                img: 'Ship1/Parts/ship1_body.png'
              },
              nose: {
                label: 'Ponta',
                price: 30000,
                buyed: false,
                img: 'Ship1/Parts/ship1_nose.png'
              },
              turbine: {
                label: 'turbina',
                price: 30000,
                buyed: false,
                img: 'Ship1/Parts/ship1_turbine.png'
              },
              datail: {
                label: 'datalhes',
                price: 30000,
                buyed: false,
                img: 'Ship1/Parts/ship1_detail.png'
              }
            }
          },
          ship2: {
            id: 2,
            page: 2,
            label: 'Sharter',
            shipLocked: false,
            img: 'Ship2/Ship2.png',
            description: 'nave desenvolvida para transporte de Mercadorias.',
            parts: {
              body: {
                label: 'Corpo',
                price: 60,
                buyed: false,
                img: 'Ship2/Parts/ship2_body.png'
              },
              nose: {
                label: 'Corpo 2',
                price: 60,
                buyed: false,
                img: 'Ship2/Parts/ship2_body2.png'
              },
              turbine: {
                label: 'Turbina',
                price: 60,
                buyed: false,
                img: 'Ship2/Parts/ship2_turbines.png'
              },
              datail: {
                label: 'datalhes',
                price: 60,
                buyed: false,
                img: 'Ship2/Parts/ship2_detail.png'
              },
              datail2: {
                label: 'datalhes 2',
                price: 60,
                buyed: false,
                img: 'Ship2/Parts/ship2_detail2.png'
              }
            }
          },
          ship3: {
            id: 3,
            page: 3,
            label: 'Equinox',
            shipLocked: false,
            img: 'Ship3/Ship3.png',
            description: 'nave desenvolvida para extrair energia.',
            parts: {
              body: {
                label: 'Corpo',
                price: 100,
                buyed: false,
                img: 'Ship3/Parts/ship3_body.png'
              },
              head: {
                label: 'Cabeça',
                price: 100,
                buyed: false,
                img: 'Ship3/Parts/ship3_head.png'
              },
              head2: {
                label: 'Cabeça 2',
                price: 100,
                buyed: false,
                img: 'Ship3/Parts/ship3_head2.png'
              },
              turbine: {
                label: 'Turbina',
                price: 100,
                buyed: false,
                img: 'Ship3/Parts/ship3_turbine.png'
              },
              datail: {
                label: 'Datalhes',
                price: 100,
                buyed: false,
                img: 'Ship3/Parts/ship3_detail.png'
              },
              tail: {
                label: 'Traseira 2',
                price: 100,
                buyed: false,
                img: 'Ship3/Parts/ship3_tail.png'
              }
            }
          },
          ship4: {
            id: 4,
            page: 4,
            label: 'Reliant',
            shipLocked: false,
            img: 'Ship4/Ship4.png',
            description: 'nave desenvolvida para trasporte de unobtainium.',
            parts: {
              body: {
                label: 'Corpo',
                price: 110,
                buyed: false,
                img: 'Ship4/Parts/ship4_body1.png'
              },
              body2: {
                label: 'Corpo 2',
                price: 110,
                buyed: false,
                img: 'Ship4/Parts/ship4_body2.png'
              },
              bodyDetail: {
                label: 'Corpo detalhe',
                price: 110,
                buyed: false,
                img: 'Ship4/Parts/ship4_body_detail.png'
              },
              tail: {
                label: 'Traseira',
                price: 110,
                buyed: false,
                img: 'Ship4/Parts/ship4_tail.png'
              },
              tubes: {
                label: 'Tubulação',
                price: 110,
                buyed: false,
                img: 'Ship4/Parts/ship4_tubes.png'
              },
              datail: {
                label: 'datalhes',
                price: 110,
                buyed: false,
                img: 'Ship4/Parts/ship4_detail.png'
              },
              window: {
                label: 'Janela',
                price: 110,
                buyed: false,
                img: 'Ship4/Parts/ship4_windows.png'
              }
            }
          },
          ship5: {
            id: 5,
            page: 5,
            label: 'Sharter',
            shipLocked: false,
            img: 'Ship5/Ship5.png',
            description: 'nave desenvolvida para entrar em nebulosas toxicas.',
            parts: {
              body: {
                label: 'Corpo',
                price: 120,
                buyed: false,
                img: 'Ship5/Parts/ship5_body1.png'
              },
              body2: {
                label: 'Corpo 2',
                price: 120,
                buyed: false,
                img: 'Ship5/Parts/ship5_body2.png'
              },
              body3: {
                label: 'Corpo 3',
                price: 120,
                buyed: false,
                img: 'Ship5/Parts/ship5_body3.png'
              },
              top: {
                label: 'Teto',
                price: 120,
                buyed: false,
                img: 'Ship5/Parts/ship5_top_detail.png'
              },
              tube: {
                label: 'Tubulação',
                price: 120,
                buyed: false,
                img: 'Ship5/Parts/ship5_tube.png'
              },
              window: {
                label: 'Janela',
                price: 120,
                buyed: false,
                img: 'Ship5/Parts/ship5_window.png'
              }
            }
          },
          ship6: {
            id: 6,
            page: 6,
            label: 'Sharter',
            img: 'Ship6/Ship6.png',
            shipLocked: false,
            description: 'nave desenvolvida para entrar em nebulosas toxicas.',
            parts: {
              body: {
                label: 'Corpo',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_body1.png'
              },
              body2: {
                label: 'Corpo 2',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_body2.png'
              },
              body3: {
                label: 'Corpo 3',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_body3.png'
              },
              circle: {
                label: 'Detalhes do Circulo',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_circle_detail.png'
              },
              turbine: {
                label: 'Turbina',
                price: 130,
                buyed: false,
                img: 'Ship2/Parts/ship2_turbines.png'
              },
              datail: {
                label: 'datalhes',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_detail1.png'
              },
              datail2: {
                label: 'datalhes 2',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_detail2.png'
              },
              datail3: {
                label: 'datalhes 3',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_detail3.png'
              },
              datail4: {
                label: 'datalhes 4',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_detail4.png'
              },
              datail5: {
                label: 'datalhes 5',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_detail5.png'
              },
              wing: {
                label: 'Asa 1',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_wing_detail1.png'
              },
              wing2: {
                label: 'Asa 2',
                price: 130,
                buyed: false,
                img: 'Ship6/Parts/ship6_wing_detail2.png'
              }

            }
          }
        },
        shipBay: [],
        questRecovery: false,
        quest: {
          moon: {
            qId: 1,
            title: '#1 - Mineração na lua',
            img: 'moon.gif',
            description: 'Existem diversos minérios na Lua, mas dentro deles há um muito raro chamado unobtainium.Crie uma base e comece a minerar para encontrá-los!',
            dust: 200000,
            cost: {
              garra: 90,
              aerogel: 80,
              escâner: 50,
              drone: 15
            },
            shipRequire: {
              id: 1,
              label: 'Tundra',
              img: 'Ship1/Ship1.png'
            },
            income: 15,
            maxIncome: 35,
            workTime: 60000,
            working: 0,
            questStarted: false,
            questNotify: false,
            progressBar: 0,
            progressBarMax: 60
          },
          market: {
            qId: 2,
            title: '#2 - Mercado espacial',
            img: 'Market.gif',
            description: 'O Mercado espacial irá vender todo lixo e sucata espacial que você armazena ao longo da jornada. Abra um mercado espacial e ganhe vendendo sucatas!',
            dust: 500000,
            cost: {
              garra: 110,
              aerogel: 120,
              Processador: 30,
              estação: 50
            },
            shipRequire: {
              id: 2,
              label: 'Sharter',
              img: 'Ship2/Ship2.png'
            },
            income: 45,
            maxIncome: 85,
            workTime: 120000,
            working: 0,
            questStarted: false,
            questNotify: false,
            progressBar: 0,
            progressBarMax: 120
          },
          warp: {
            qId: 3,
            title: '#3 - Portal Quebrado',
            img: 'warp.gif',
            description: 'Foi encontrado um portal quebrado porém a energia usada para abri-lo ainda está disponível para coleta.',
            dust: 800000,
            cost: {
              garra: 150,
              aerogel: 160,
              Processador: 50,
              estação: 80,
              drone: 40
            },
            shipRequire: {
              id: 3,
              label: 'Equinox',
              img: 'Ship3/Ship3.png'
            },
            income: 75,
            maxIncome: 105,
            workTime: 180000,
            working: 0,
            questStarted: false,
            questNotify: false,
            progressBar: 0,
            progressBarMax: 180
          },
          base: {
            qId: 4,
            title: '#4 - Base Mineradora',
            img: 'base.gif',
            description: 'Uma base orbital de mineração de unobtainium está disponível.',
            dust: 1000000,
            cost: {
              garra: 200,
              aerogel: 210,
              Processador: 80,
              escâner: 100,
              estação: 100,
              drone: 50,
              conversor: 20
            },
            shipRequire: {
              id: 4,
              label: 'Reliant',
              img: 'Ship4/Ship4.png'
            },
            income: 95,
            maxIncome: 125,
            workTime: 240000,
            working: 0,
            questStarted: false,
            questNotify: false,
            progressBar: 0,
            progressBarMax: 240
          }
        }
      }
    }
  },

  computed: {
    // ...mapGetters(['user']),

    user () {
      return this.$store.getters.user
    },

    menuElementType () {
      return !this.modeMobile ? 'q-header' : 'q-footer'
    },

    qtdDustConvert () {
      const result = this.convertAmount * this.game.items.conversor.multiply
      return result
    },

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

    modeMobile () {
      return this.$q.screen.lt.sm
    },

    spaceClicker () {
      return this.$q.screen.lt.sm ? 'starship starship__mobile text-white q-mt-sm' : 'q-mt-sm starship text-white q-gutter-xs'
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

    unobtainiumAmount () {
      return this.game.unobtainium
    },

    shipOne () {
      return this.game.ship.ship1.shipLocked
    },

    shipOFour () {
      return this.game.ship.ship4.shipLocked
    },

    missionOne () {
      return this.game.quest.moon.questStarted
    },

    conversorUpgrade () {
      return this.game.items.conversor.ups
    }

  },

  watch: {
    animatedNumber (newValue) {
      gsap.to(this.$data, { duration: 0.5, cosmicDustCount: newValue })
    },

    // CONQUISTAS
    conversorUpgrade (newValue) {
      if (newValue === 1 && !this.game.achievementsList.convertAchievTwo.conquest) {
        this.game.achievementsList.convertAchievTwo.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.convertAchievTwo.label)
      }
    },

    missionOne (newValue) {
      if (newValue && !this.game.achievementsList.missionAchiv.conquest) {
        this.game.achievementsList.missionAchiv.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.missionAchiv.label)
      }
    },

    shipOFour (newValue) {
      if (newValue && !this.game.achievementsList.shipAchivTwo.conquest) {
        this.game.achievementsList.shipAchivTwo.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.shipAchivTwo.label)
      }
    },

    shipOne (newValue) {
      if (newValue && !this.game.achievementsList.shipAchiv.conquest) {
        this.game.achievementsList.shipAchiv.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.shipAchiv.label)
      }
    },

    unobtainiumAmount (newValue) {
      if (newValue === 100 && !this.game.achievementsList.unobtainiumAmount.conquest) {
        this.game.achievementsList.unobtainiumAmount.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.unobtainiumAmount.label)
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
      if (newValue === 1 && !this.game.achievementsList.garraAchiv.conquest) {
        this.game.achievementsList.garraAchiv.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.garraAchiv.label)
      }

      if (newValue === 50 && !this.game.achievementsList.garraAchivTwo.conquest) {
        this.game.achievementsList.garraAchivTwo.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.garraAchivTwo.label)
      }

      if (newValue === 100 && !this.game.achievementsList.garraAchivThree.conquest) {
        this.game.achievementsList.garraAchivThree.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.garraAchivThree.label)
      }
    },

    garraEfficiency (newValue) {
      if (newValue > 50 && !this.game.achievementsList.garraEfficiencyAchiv.conquest) {
        this.game.achievementsList.garraEfficiencyAchiv.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.garraEfficiencyAchiv.label)
      }

      if (newValue > 150 && !this.game.achievementsList.garraEfficiencyAchivTwo.conquest) {
        this.game.achievementsList.garraEfficiencyAchivTwo.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.garraEfficiencyAchivTwo.label)
      }

      if (newValue > 250 && !this.game.achievementsList.garraEfficiencyAchivThree.conquest) {
        this.game.achievementsList.garraEfficiencyAchivThree.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.garraEfficiencyAchivThree.label)
      }
    },

    aerogelAmount (newValue) {
      if (newValue === 100 && !this.game.achievementsList.aerogelAmountAchiv.conquest) {
        this.game.achievementsList.aerogelAmountAchiv.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.aerogelAmountAchiv.label)
      }

      if (newValue === 200 && !this.game.achievementsList.aerogelAmountAchivTwo.conquest) {
        this.game.achievementsList.aerogelAmountAchivTwo.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.aerogelAmountAchivTwo.label)
      }
    },

    cosmicDustAmount (newValue) {
      if (newValue > 1000000 && !this.game.achievementsList.cosmicDustAchiv.conquest) {
        this.game.achievementsList.cosmicDustAchiv.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.cosmicDustAchiv.label)
      }

      if (newValue > 1000000000 && !this.game.achievementsList.cosmicDustAchivTwo.conquest) {
        this.game.achievementsList.cosmicDustAchivTwo.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.cosmicDustAchivTwo.label)
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
      if (newValue >= 1 && !this.game.achievementsList.droneAchiv.conquest) {
        this.game.achievementsList.droneAchiv.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.droneAchiv.label)
      }

      if (newValue >= 15 && !this.game.achievementsList.droneAchivTwo.conquest) {
        this.game.achievementsList.droneAchivTwo.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.droneAchivTwo.label)
      }

      if (newValue >= 50 && !this.game.achievementsList.droneAchivThree.conquest) {
        this.game.achievementsList.droneAchivThree.conquest = true
        this.achievementSong()
        this.achievementNotify(this.game.achievementsList.droneAchivThree.label)
      }
    }
  },

  created () {
    this.getDustperSecond()
    // this.saveGame()
    this.signIn()
    this.authUser()
  },

  mounted () {
    if (localStorage.getItem(this.version)) {
      try {
        this.game = JSON.parse(localStorage.getItem(this.version))
      } catch (e) {
        console.log(e)
      }
    } else {
      localStorage.removeItem(this.oldVersion)
      // this.saveGame()
    }
    // setup
    this.recovery()
    this.isQuestRecovery()
    this.setVolume(0.2)
  },

  methods: {
    ...mapActions(['signIn']),

    toRevealToggle () {
      this.toReveal = !this.toReveal
    },

    authUser () {
      if (!this.user) {
        this.$router.replace({ name: 'login' })
      }
    },

    logout () {
      this.exit = true
      setTimeout(() => {
        this.exit = false
        firebase.auth().signOut().then(() => {
          this.$router.replace({ name: 'login' })
        })
      }, 1000)
    },

    equipShip (model) {
      this.game.shipEquiped.img = model.img
      this.game.shipEquiped.id = model.id
      model.shipLocked = true
    },

    unquipShip (model) {
      this.game.shipEquiped.img = 'vehicle.gif'
      this.game.shipEquiped.id = 0
      model.shipLocked = false
    },

    checkParts (item) {
      let locked = false
      for (const key in item.parts) {
        if (!item.parts[key].buyed) {
          locked = true
        }
      }
      return locked
    },

    shipPartCheck (parts, type) {
      if (parts.buyed) {
        if (type === 'label') {
          return 'Equipado'
        }
        if (type === 'color') {
          return 'warning'
        }
      } else {
        if (type === 'label') {
          return 'Comprar'
        }
        if (type === 'color') {
          return 'green'
        }
      }
    },

    missionEquipShip (model) {
      this.equipShip(model)
    },

    buyPart (parts, item) {
      if (item.id === 1) {
        if (this.game.cosmicDust >= parts.price && !parts.buyed) {
          this.game.cosmicDust -= parts.price
          parts.buyed = true
          this.$refs.buyItem.play()
        // TODO colocar som de equipando
        }
      }

      if (this.game.unobtainium >= parts.price && !parts.buyed) {
        this.game.unobtainium -= parts.price
        parts.buyed = true
        this.$refs.buyItem.play()
        // TODO colocar som de equipando
      } else {
        // TODO desabilitar botão
      }
    },

    changePage (model) {
      this.$refs.buyItem.play()
    },

    setVolume (vol) {
      this.$refs.music.volume = vol
      this.$refs.buyItem.volume = vol
      this.$refs.MissionComplete.volume = vol
      this.$refs.MissionStartSong.volume = vol
      this.$refs.error.volume = vol
      this.$refs.convert.volume = vol
    },

    toggleBg (model) {
      this.bg = model === 'inventory' ? 'bg-warning' : 'bg-blue'
    },

    revelar (model) {
      if (this.game.unobtainium > 100) {
        this.game.unobtainium -= 100
        this.toReveal = false
        model.conquestRevel = true
      } else {
        this.$refs.error.play()
        this.$q.notify({
          message: '<span class="font" style="font-size: 8px;">Alerta<br><strong>Não tem unobtainium suficiente</strong></span>',
          multiLine: true,
          html: true,
          timeout: 6000,
          progress: true,
          avatar: require('../assets/unobtainium.png'),
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
          if (this.game.shipEquiped.id !== item.shipRequire.id) {
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
              this.game.unobtainium += Math.floor(Math.random() * (item.maxIncome - item.income) + item.income)
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
      return result
    },

    gameEquipamentsFilter () {
      const filter = 'type'
      const result = Object.keys(this.game.items).reduce((acc, val) =>
        (this.game.items[val][filter] === 'item' ? acc : { ...acc, [val]: this.game.items[val] }), {})

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
      som.volume = this.musicVolume
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
      if (this.convertAmount <= this.game.unobtainium && this.convertAmount > 0) {
        this.game.items.conversor.status = 'working'
        this.$refs.convert.play()
        this.game.unobtainium -= this.convertAmount
        const work = setInterval(() => {
          this.game.items.conversor.timeLaunch = working
          working--
          if (working === 0) {
            clearInterval(work)
            this.game.items.conversor.timesConvert += 1
            this.game.items.conversor.status = 'pronto'
            this.game.items.conversor.timeLaunch = 0
            const convertValue = this.convertAmount * this.game.items.conversor.multiply
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
      this.game.droneFunction.labelDrone = 'Coletando Poeira'
      this.game.droneFunction.colorDrone = 'bg-blue'
      this.game.droneFunction.droneSend = true
      this.game.cosmicDustPerSecond += this.game.items.drone.launchValue
      this.game.droneFunction.droneTimer = this.game.items.drone.timeLaunch
      this.game.droneFunction.droneMaxTime = this.game.items.drone.timeLaunch
      this.game.items.drone.status = 'working'
      const som = new Audio('http://soundimage.org/wp-content/uploads/2016/04/PowerUp28.mp3')
      som.play()
      som.volume = 0.5

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
            this.game.droneFunction.droneTimer = this.game.items.drone.bateryRecover
            this.game.droneFunction.droneMaxTime = this.game.items.drone.bateryRecover
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
      this.game.items[model.uplink].ups += 1
    },

    buyUpgrade (model) {
      this.$refs.buyItem.play() // efeito sonoro do botão
      switch (model.idu) {
        // garra
        case 1:
          if (this.game.cosmicDust >= model.price) {
            if (model.label === 'Click Pro') {
              this.game.cosmicDust -= model.price
              this.game.click += model.value

              model.price += model.price * 0.2
              model.value += 0.3
              model.totalSpent += model.price

              this.addInstallCountItem(model)
            }
            if (model.label === 'Garra Pro') {
              this.game.cosmicDust -= model.price
              this.game.items[model.uplink].value += model.value

              model.price += model.price * 0.2
              model.value += 0.2
              model.totalSpent += model.price

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
            model.value += 0.2
            if (this.game.items[model.uplink].ups === 9) {
              model.value += 10
            }
            if (this.game.items[model.uplink].ups === 19) {
              model.value += 20
            }
            if (this.game.items[model.uplink].ups === 49) {
              model.value += 30
            }
            model.totalSpent += model.price

            this.addInstallCountItem(model)
          }
          break
        // Processador
        case 3:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price
            this.game.items[model.uplink].value += model.value

            model.price += model.price * 0.2
            model.value += 0.2
            model.totalSpent += model.price

            this.addInstallCountItem(model)
          }
          break
        // escâner
        case 4:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price
            this.game.items[model.uplink].value += model.value

            model.value += 0.2
            model.totalSpent += model.price
            model.price += model.price * 0.2

            this.addInstallCountItem(model)
          }
          break
        // Drone
        case 5:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price
            if (model.label === 'Drone Pro') {
              this.game.items[model.uplink].value += model.value
              model.price += model.price * 0.2
              model.value += 0.2
              model.totalSpent += model.price
            }
            if (model.label === 'Drone Sentinela') {
              this.game.items.drone.launchValue += model.value
              model.price += model.price * 0.2
              model.value += 0.5
            }
            if (model.label === 'Bateria de Drone') {
              this.game.items.drone.timeLaunch += model.value
              this.game.items.drone.bateryRecover += 1
              model.price += model.price * 0.2
            }
            this.addInstallCountItem(model)
          }
          break
        // Estação
        case 6:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price
            this.game.items[model.uplink].value += model.value

            model.value += 0.2
            model.totalSpent += model.price
            model.price += model.price * 0.2

            this.addInstallCountItem(model)
          }
          break
        // Conversor
        case 7:
          if (this.game.cosmicDust >= model.price) {
            this.game.cosmicDust -= model.price
            if (model.label === 'Conversor Pro') {
              this.game.items[model.uplink].value += model.value

              model.value += 0.2
              model.totalSpent += model.price
              model.price += model.price * 0.2
            }

            if (model.label === 'Conversor Diamante') {
              this.game.items.conversor.multiply += 5000
              this.game.items.conversor.launchValue += 20
              model.totalSpent += model.price // total Gasto
              model.price += model.price * 0.5
            }

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

        if (model.amount < 100) {
          model.price += model.price * 0.05
        } else {
          model.price += model.price * 0.08
        }
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
      } else {
        this.$q.notify({
          message: 'Atenção<br><strong>Quantidade de Poeira cosmica insuficiente</strong>',
          multiLine: true,
          html: true,
          timeout: 6000,
          progress: true,
          avatar: require('../assets/cosmic.png'),
          color: 'negative'
        })
      }
    },

    setCompanyName () {
      this.setName = !this.setName
    },

    getDust () {
      const clickPoints = document.createElement('span')
      const levelUpEfects = document.createElement('img')
      const positionX = Math.floor(Math.random() * (30 + 5) + 1)
      const positionY = Math.floor(Math.random() * (100 + 80) + 50)

      levelUpEfects.setAttribute('src', 'https://i.imgur.com/qgpcufH.gif')
      levelUpEfects.setAttribute('class', 'animate levelUp ')
      levelUpEfects.style.setProperty('--number', positionX + 'px')
      levelUpEfects.style.setProperty('--numberY', '-' + positionY + 'px')

      clickPoints.setAttribute('class', 'animate')
      clickPoints.textContent = '+' + (this.game.click * this.game.levelBonus).toFixed(0)
      clickPoints.style.setProperty('--number', positionX + 'px')
      clickPoints.style.setProperty('--numberY', '-' + positionY + 'px')

      document.getElementById('float').appendChild(clickPoints)
      setTimeout(() => {
        document.getElementById('float').removeChild(clickPoints)
      }, 2000)
      // XP
      this.game.levelUp += 1
      if (this.game.levelUp === this.game.maxlevelUp) {
        this.game.levelUp = 0
        this.game.level += 1
        this.game.maxlevelUp += 2
        this.game.levelBonus += 0.2
        if (this.level === 10) {
          this.game.maxlevelUp += 20
        }
        if (this.level === 15) {
          this.game.maxlevelUp += 40
        }
        if (this.level === 20) {
          this.game.maxlevelUp += 80
        }
        document.getElementById('levelUpEfect').appendChild(levelUpEfects)
        setTimeout(() => {
          document.getElementById('levelUpEfect').removeChild(levelUpEfects)
        }, 3000)
      }

      // DUST
      this.game.cosmicDust += (this.game.click * this.game.levelBonus)
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

    saveGameForced () {
      const parsed = JSON.stringify(this.game)
      localStorage.setItem(this.version, parsed)
      const time = new Date()
      this.saveStatus = date.formatDate(time, 'DD/MM/YYYY [-] HH:mm[h]')
      this.$q.notify({
        message: '<strong>Jogo Salvo Manual</strong>',
        html: true,
        timeout: 500,
        progress: true,
        position: 'top-right',
        color: 'positive'
      })
    },

    saveGame () {
    //   TODO salvar ocasional, com ações no jogo
      // TODO salvar local ref com uid do users
      const parsed = JSON.stringify(this.game)
      localStorage.setItem(this.version, parsed)
      const time = new Date()
      this.saveStatus = date.formatDate(time, 'DD/MM/YYYY [-] HH:mm[h]')
      // const save = setInterval(() => {
      //   if (this.exit) {
      //     clearInterval(save)
      //   } else {
      //     const parsed = JSON.stringify(this.game)
      //     localStorage.setItem(this.version, parsed)
      //     const time = new Date()
      //     this.saveStatus = date.formatDate(time, 'DD/MM/YYYY [-] HH:mm[h]')
      //     if (this.$route.name === 'space') {
      //       this.$q.notify({
      //         message: '<strong>Jogo Salvo</strong>',
      //         html: true,
      //         timeout: 5000,
      //         progress: true,
      //         position: 'top-right',
      //         color: 'Positive'
      //       })
      //     }
      //   }
      // }, 60000)
    }
  }
}
</script>

<style lang="scss">
@import "node_modules/pixel-borders/src/styles/pixel-borders.scss";

.glass {
  opacity: 0.8;
  backdrop-filter: blur(5px);
  &--5 {
    opacity: 0.5;
    backdrop-filter: blur(5px);
  }
}

#float {
  position: absolute;
  top: 50px;
  left: 50px;
  z-index: 1000;
  user-select: none;
}

#levelUpEfect {
  position: absolute;
  top: 20px;
  left: 50px;
  z-index: 1000;
}

.levelUp {
  width: 100px;
  height: 30px;
}

.animate {
  position: absolute;
  font-size: 15px;
  text-shadow: 3px 3px 0px rgb(0, 0, 0, 0.5);
  color: rgb(255, 255, 255);

  animation: floatUP 3s;
}

@keyframes floatUP {
  from { transform: translateX(var(--number)); }
  to   { transform: translateY(var(--numberY));
         opacity: 0;
       }
}
.closeBtn {
  position: absolute;
  bottom: 5px;
  width: 300px;
}

.upgradeDialog {
  background-image: url('https://i.pinimg.com/originals/2d/3c/85/2d3c85f4fae58e749ba5b0d22521fe3d.gif');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 5px;
  border-style: solid;
  border-color: black;
  border-width: 2px;
  min-height: 500px;
  width: 400px;

  &__item {
    background:rgba($color: #fff, $alpha: 0.7);
  }
}

.achivements {
  background-color:rgba(0, 0, 0, 0.1);
  &__item-list {
    border-radius: 8px;
    background: $warning;

    img {
      width: 50px;
    }
  }
}

.contact {
  width: 300px;
}
.pagination {
  position: absolute;
  bottom: 10px;
  right: 200px;
  // top: 0;
}

.items-buyed {
  position: relative;
  padding-bottom: 10px;
  padding-left: 5px;

  &__list {
  margin-left: 3px;

  }
  &__img {
     width: 26px;
  }
}

.company {
  background-image: url(https://i.pinimg.com/originals/76/2c/1b/762c1b9d0b7e7370a45070fad43aca2f.gif);
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: -20px;
  width: 300px;
}

.information {
  position: absolute;
  font-size: 10px;
  background-color: white;
  width: 290px;
  border-radius: 3px;
}

.starship {
  background-color:rgba(0, 0, 0, 0.1);
  width: 400px;

  &__mobile {
    width: 100%;
  }

    // background-image: url(https://i.pinimg.com/originals/59/31/5f/59315fc4a62dd36b63f40b300ac793b2.gif);
    // background-size: cover;
    // background-repeat: no-repeat;

  &__items {
    background-image: url(../assets/bg-stars.gif);
    img {
      width: 40px;
    }
    &__ships {
    background-image: url(../assets/bay.jpg);
    }
  }
}

.not-avaliable {
  position: absolute;
  z-index: 1;
  right: 1px;
  // top: 220px;
  // margin: 0 -5px 0 0;
  // padding: 0 0 20px 0;
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
