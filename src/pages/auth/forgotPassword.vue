<template>
  <div class="fullscreen text-white text-center q-pl-sm page font">
    <div class="bg-warning q-pa-lg border--5 shadow-3 q-gutter-sm create animate__animated animate__bounceIn">
      <q-img src="../../assets/cosmic.png" style="width: 100px;" class="animate__animated animate__fadeInDown" />
      <div class="text-h5 animate__animated animate__jackInTheBox">Space Clicker</div>
      <div class="bg-white q-pa-md q-ma-sm border--5 q-gutter-y-md">
        <div class="text-black font--8 text-center">Vamos enviar um email para <br> resetar sua senha!</div>
        <q-input v-model="email" label="e-mail"  class="border--5 font--8" outlined  dense autofocus label-color="black"
                 type="email" :error='asErrorMail' :error-message='error' hint="seu email de acesso!" hide-hint />
      </div>
      <div class="q-mt-md q-gutter-y-sm">
        <q-btn label="Enviar" color="green" class="fit" push @click="resetPassword" />
        <q-btn label="cancelar" color="white" flat class="fit" @click="animate('login')"/>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { mapActions } from 'vuex'
import { animate } from 'src/mixin/animate.js'

export default {
  name: 'forgotPassword',

  mixins: [animate],

  data () {
    return {
      asErrorMail: false,
      error: '',
      email: ''
    }
  },

  created () {
    this.logOut()
    clearInterval()
  },

  methods: {
    ...mapActions([
      'signIn',
      'logOut'
    ]),

    resetPassword () {
      firebase.auth().sendPasswordResetEmail(this.email).then(
        (user) => {
          this.$q.notify({
            message: 'E-mail enviado com sucesso!',
            progress: true,
            color: 'positive'
          })

          this.$router.replace({ name: 'login' })
        },

        (error) => {
          if (error.code === 'auth/user-not-found') {
            this.asErrorMail = true
            this.error = this.email.length === 0 ? 'Não pode ser vazio' : 'E-mail inválido'
          }

          if (error.code === 'auth/invalid-email') {
            this.asErrorMail = true
            this.error = this.email.length === 0 ? 'Não pode ser vazio' : 'E-mail inválido'
          }
        }
      )
    }
  }
}
</script>
