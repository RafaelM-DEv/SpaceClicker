<template>
  <div class="fullscreen text-white text-center page font">
    <div :class="isMobile">
      <div class="q-ma-md">
        <q-img src="../../assets/cosmic.png" style="width: 100px;" class="animate__animated animate__fadeInDown" />
        <div class="text-h5 animate__animated animate__jackInTheBox">Space Clicker</div>
        <div class="bg-white q-pa-md q-my-sm border--5 column full-width column">
          <q-input v-model="email" label="E-mail" class="border--5 font--8" outlined dense autofocus label-color="black"
                   type="email" :error='asErrorMail' :error-message='error' :hint="$t('message.hint.email')" hide-hint />
          <q-input v-model="password" :label="$t('message.password')" class="border--5  font--8" outlined dense label-color="black"
                   :error='asErrorPass' :error-message='error' :type="isPwd ? 'password' : 'text'" :hint="$t('message.signUp.char')" hide-hint>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPassword"/>
            </template>
          </q-input>
        </div>
        <div class="q-mt-md">
          <q-btn :label="$t('message.create')" color="blue" push class="fit" @click="signUp" />
          <q-btn :label="$t('message.forgotPassword.cancel')" color="white" flat class="fit" @click="animate('login')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'

import { mapGetters } from 'vuex'
import { animate } from '../../mixin/animate.js'
import { screen } from '../../mixin/screen.js'

export default {
  name: 'signin',

  mixins: [animate, screen],

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

  created () {
    this.authUser()
    clearInterval()
  },

  methods: {
    authUser () {
      if (this.user) {
        this.$router.replace({ name: 'space' })
      }
    },

    signUp () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$q.notify({
            message: 'Bem-vindo ao Space Clicker!',
            color: 'positive'
          })
          return this.animate('login')
        },
        (error) => {
          if (error.code === 'auth/email-already-in-use') {
            this.asErrorPass = true
            this.$q.notify({
              message: error.message,
              color: 'negative'
            })
          }
          if (error.code === 'auth/weak-password') {
            this.asErrorPass = true
            this.error = this.password.length === 0 ? this.$t('message.forgotPassword.error') : this.$t('message.signUp.char')
          }
          if (error.code === 'auth/invalid-email') {
            this.asErrorMail = true
            this.error = this.email.length === 0 ? this.$t('message.forgotPassword.error') : this.$t('message.forgotPassword.invalidEmail')
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
