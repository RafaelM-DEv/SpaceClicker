<template>
  <q-dialog v-model="showDialog" :value="value ">
    <q-card style="min-width: 100px;" class="flex justify-center pixel-borders--1">
      <q-card-section class="column q-gutter-y-sm">
          <q-icon name="img:https://i.pinimg.com/originals/45/1a/27/451a27df78f84c8f671ec1e502a4fe97.gif" class="flex self-center robot"/>
          <div class="font devDialog pixel-borders--1">
            <div>
              É com um grande prazer que estou lançando esse update depois de tanto trabalho! Espero de verdade que gostem e tenham uma
              exelente experiencia.
            </div>
          <div class="text-center q-my-sm text-bold">
              Update log 23/05/2021
          </div>
          <p>>Adicionado uma nova moeda.</p>
          <p>>Novas Conquistas e nova função de revelar.</p>
          <p>>Adicionado menu de Missões com duas missões e inventário(para equipamentos).</p>
          <p>>Adicionado menu de equipamentos.</p>
          <p>>Adicionado novo equipamento para converter a nova moeda em poeira cósmica.</p>
          <p>>Removido item de bateria.</p>
          <p>>Adicionado novo item "Processador".</p>
          <p>>Adicionado novo item "estação".</p>
          <p>>Atualizado elementos do layout e ícones.</p>
          </div>
      </q-card-section>

      <q-card-actions>
          <div class="q-mb-md font">
          <q-btn label="ok" v-close-popup class="bg-warning" @click="toggle()" />
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
  },

  methods: {
    toggle () {
      this.$emit('showView', false)
    }
  }

}
</script>
