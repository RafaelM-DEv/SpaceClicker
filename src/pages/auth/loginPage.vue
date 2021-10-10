<template>
  <div class="fullscreen text-white text-center q-pl-sm page font">
      <div class="bg-warning q-pa-lg border--5 shadow-3 q-gutter-sm create animate__animated animate__bounceIn">
          <q-img src="../../assets/cosmic.png" style="width: 100px;" class="animate__animated animate__fadeInDown" />
          <div class="text-h5 animate__animated animate__jackInTheBox">Space Clicker</div>
          <div class="bg-white q-pa-md q-my-sm border--5 q-gutter-y-md">
            <q-input v-model="email" label="e-mail"  class="border--5 font--8" outlined  dense autofocus label-color="black"
                     type="email" :error='asErrorMail' :error-message='erro' hint="seu email de acesso!" hide-hint />
            <q-input v-model="password"  label="Senha" class="border--5  font--8" outlined dense label-color="black"
                     :error='asErrorPass' :error-message='erro' :type="isPwd ? 'password' : 'text'" hint="não tem ninguém vendo!" hide-hint>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword"/>
              </template>
            </q-input>
          </div>
          <div class="q-mt-md q-gutter-y-sm">
            <q-btn label="Entrar" color="green" class="fit" push @click="login"/>
            <q-btn label="criar conta" color="blue" class="fit" push @click="animate('signin')" />
          </div>
          <q-btn label="Esqueci a senha!" color="white" class="fit" flat push  @click="animate('forgotPassword')" />
      </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { mapActions } from 'vuex'
import { animate } from '../../mixin/animate.js'

export default {
  name: 'login',

  mixins: [animate],

  data () {
    return {
      asErrorMail: false,
      asErrorPass: false,
      erro: '',
      isPwd: true,
      email: '',
      password: ''
    }
  },

  created () {
    this.logOut()
    clearInterval()
  },

  watch: {
    email (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.asErrorMail = false
      }
    },

    password (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.asErrorPass = false
      }
    }
  },

  methods: {
    ...mapActions([
      'signIn',
      'logOut'
    ]),

    login () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          localStorage.setItem('userClicker', JSON.stringify(user))
          this.signIn()
          this.$router.replace({ name: 'space' })
        },

        (error) => {
          if (error.code === 'auth/user-not-found') {
            this.asErrorMail = true
            this.erro = 'E-mail não existe'
          }

          if (error.code === 'auth/wrong-password') {
            this.asErrorPass = true
            this.erro = this.password.length === 0 ? 'Não pode ser vazio' : 'Senha inválida'
          }

          if (error.code === 'auth/invalid-email') {
            this.asErrorMail = true
            this.erro = this.email.length === 0 ? 'Não pode ser vazio' : 'E-mail não é válido'
          }

          if (error.code === 'auth/too-many-requests') {
            this.$router.go(0)
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
