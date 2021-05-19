<template>
  <q-dialog v-model="showDialog" :value="value ">
    <q-card style="min-width: 100px;" class="flex justify-center pixel-borders--1">
      <q-card-section class="column q-gutter-y-sm">
          <q-icon name="img:https://i.pinimg.com/originals/45/1a/27/451a27df78f84c8f671ec1e502a4fe97.gif" class="flex self-center robot"/>
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
          <q-btn label="ok" v-close-popup class="bg-warning" />
          </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {

  props: {
    value: {
      type: Boolean
    }
  },

  data () { return { showDialog: this.value } },

  watch: {
    value (value) {
      this.showDialog = this.value
    }
  }

}
</script>
