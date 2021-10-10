<template>
  <div class="fullscreen text-white text-center q-pl-sm page font">
      <div class="bg-warning q-pa-lg border--5 shadow-3 q-gutter-sm create animate__animated animate__bounceIn">
          <q-img src="../../assets/cosmic.png" style="width: 100px;" class="animate__animated animate__fadeInDown" />
          <div class="text-h5 animate__animated animate__jackInTheBox">Space Clicker</div>
          <div class="bg-white q-pa-md q-ma-sm border--5 q-gutter-y-md ">
          <q-input v-model="email" label="e-mail"  class="border--5 font--8" outlined  dense autofocus label-color="black"
                   type="email" :error='asErrorMail' :error-message='error' hint="seu email favorito!" hide-hint />
          <q-input v-model="password"  label="Senha" class="border--5  font--8" outlined dense label-color="black"
                   :error='asErrorPass' :error-message='error' :type="isPwd ? 'password' : 'text'" hint="não tem ninguém vendo!" hide-hint>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword"/>
            </template>
          </q-input>
          </div>
          <div class="q-mt-md flex justify-center q-gutter-x-sm">
            <q-btn label="Cadastrar" color="blue" push class="fit" @click="signUp" />
            <q-btn label="cancelar" color="white" flat class="fit" @click="animate('login')" />
          </div>
      </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { animate } from '../../mixin/animate.js'

export default {
  name: 'signin',

  mixins: [animate],

  data () {
    return {
      asErrorPass: false,
      asErrorMail: false,
      error: '',
      isPwd: true,
      email: '',
      password: ''
    }
  },

  methods: {
    signUp () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$q.notify({
            message: 'Bem-vindo ao Space Clicker!',
            color: 'positive'
          })
          return this.animate()
        },
        (error) => {
          if (error.code === 'auth/weak-password') {
            this.asErrorPass = true
            this.error = this.password.length === 0 ? 'Não pode ser vazio' : 'tem quer no mínimo 6 caracteres'
          }
          if (error.code === 'auth/invalid-email') {
            this.asErrorMail = true
            this.error = this.email.length === 0 ? 'Não pode ser vazio' : 'E-mail não é válido'
          }
        }
      )
    },

    showPassword () {
      this.isPwd = !this.isPwd
    }
  }
}

</script>
