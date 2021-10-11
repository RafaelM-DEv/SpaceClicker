<template>
   <div class="fullscreen text-white text-center page font">
    <div :class="isMobile">
      <div class="q-ma-md">
        <q-img src="../../assets/cosmic.png" style="width: 100px;" class="animate__animated animate__fadeInDown" />
        <div class="text-h5 animate__animated animate__jackInTheBox">Space Clicker</div>
        <div class="bg-white q-pa-md q-my-sm border--5 column full-width">
          <q-input v-model="email" label="e-mail" class="border--5 font--8" outlined dense autofocus label-color="black"
                    type="email" :error='asErrorMail' :error-message='error' hint="seu email favorito!" hide-hint />
          <q-input v-model="password"  label="Senha" class="border--5  font--8" outlined dense label-color="black"
                    :error='asErrorPass' :error-message='error' :type="isPwd ? 'password' : 'text'" hint="não tem ninguém vendo!" hide-hint>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword"/>
            </template>
          </q-input>
        </div>
        <div class="q-mt-md q-gutter-y-sm">
          <q-btn label="Entrar" color="green" class="fit" push @click="login"/>
          <q-btn label="criar conta" color="blue" class="fit" push @click="animate('signin')" />
        </div>
          <q-btn label="Esqueci a senha!" color="white" class="fit" flat  @click="animate('forgotPassword')" />
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'

import { mapActions, mapGetters } from 'vuex'
import { animate } from '../../mixin/animate.js'
import { screen } from '../../mixin/screen.js'

export default {
  name: 'login',

  mixins: [animate, screen],

  data () {
    return {
      asErrorMail: false,
      asErrorPass: false,
      error: '',
      isPwd: true,
      email: '',
      password: ''
    }
  },

  mounted () {
    this.authUser()
    clearInterval()
  },

  computed: {
    ...mapGetters([
      'user'
    ]),

    isMobile () {
      return this.$_untilMedium
        ? 'fit flex text-center justify-center items-center bg-warning create animate__animated animate__bounceIn'
        : 'page-login__card border--5 bg-warning create animate__animated animate__bounceIn'
    }
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
      'signIn'
    ]),

    authUser () {
      if (this.user) {
        this.$router.replace({ name: 'space' })
      }
    },

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
            this.error = 'E-mail não existe'
          }

          if (error.code === 'auth/wrong-password') {
            this.asErrorPass = true
            this.error = this.password.length === 0 ? 'Não pode ser vazio' : 'Senha inválida'
          }

          if (error.code === 'auth/invalid-email') {
            this.asErrorMail = true
            this.error = this.email.length === 0 ? 'Não pode ser vazio' : 'E-mail não é válido'
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
