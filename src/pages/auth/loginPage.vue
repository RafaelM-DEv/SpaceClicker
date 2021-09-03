<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center page font">
      <div class="bg-warning q-pa-lg border--5 shadow-3 q-gutter-sm create animate__animated animate__bounceIn">
          <q-img src="../../assets/cosmic.png" style="width: 100px;" class="animate__animated animate__fadeInDown" />
          <div class="text-h5 animate__animated animate__jackInTheBox">Space Clicker</div>
          <q-input v-model="email" class="font--10 bg-white border--5 shadow-2" outlined dense label-color="black" :error='asErrorMail' :error-message='erro' label="E-mail" type="email" hint="não vai errar." lazy-rules :rules="[ val => val && val.length > 0 || 'vazio tbm não dá certo :(' ]"/>
           <q-input v-model="password" @keyup.enter="login" class="bg-white border--5 shadow-2 font--10" :error='asErrorPass' :error-message='erro' label="Senha" outlined dense label-color="black" :type="isPwd ? 'password' : 'text'" hint="não tem ninguém vendo!">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
            </template>
          </q-input>
          <div class="q-mt-md">
            <q-btn label="Entrar" color="green" push class="shadow-2" @click="login"/>
            <q-btn label="criar conta" color="white" outline flat class="font--10" @click="animate"/>
          </div>
      </div>
  </div>
</template>

<script>
// import 'firebase/<PACKAGE>'
import firebase from 'firebase/app'
import { mapActions } from 'vuex'

export default {
  name: 'login',

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

  methods: {
    ...mapActions([
      'signIn',
      'logOut'
    ]),

    animate () {
      const element = document.querySelector('.create')
      element.classList.add('animate__animated', 'animate__bounceOut')
      element.addEventListener('animationend', () => {
        this.$router.replace({ name: 'signin' })
      })
    },

    login () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          localStorage.setItem('userClicker', JSON.stringify(user))
          this.signIn()
          this.$router.replace({ name: 'space' })
        },

        (error) => {
          console.log(error.code)

          if (error.code === 'auth/wrong-password') {
            this.asErrorPass = true
            this.asErrorMail = false
            this.erro = 'Algo errado não está certo!'
          }
          if (error.code === 'auth/invalid-email') {
            this.asErrorMail = true
            this.erro = this.erro ? 'E-mail is invalid' : 'not empty'
          }
          if (error.code === 'auth/too-many-requests') {
            alert('you made a mistake many times this page will reload')
            this.$router.go(0)
          }
        }
      )
    }
  }
}
</script>
