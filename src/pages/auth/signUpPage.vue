<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center page font ">
      <div class="bg-warning q-pa-lg border--5 shadow-3 q-gutter-sm create animate__animated animate__bounceIn">
          <q-img src="../../assets/cosmic.png" style="width: 100px;" class="animate__animated animate__fadeInDown" />
          <div class="text-h5 animate__animated animate__jackInTheBox">Space Clicker</div>
          <q-input v-model="email" label="e-mail" outlined  dense label-color="black" class="font--10 bg-white border--5 shadow-2" type="email" :error='asErrorMail' :error-message='erro' hint="seu email favorito!" />
           <q-input v-model="password" :error='asErrorPass' :error-message='erro' label="Senha" outlined dense label-color="black" class="font--10 bg-white border--5 shadow-2" :type="isPwd ? 'password' : 'text'" hint="não tem ninguém vendo!">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
            </template>
          </q-input>
          <div class="q-mt-md flex justify-center q-gutter-x-sm">
            <q-btn label="voltar" color="white" flat class="font--10" :to="{ name: 'login'}" @keyup.esc="animate"/>
            <q-btn label="Cadastrar" color="blue" push class="shadow-2" @click="signUp" @keyup.enter="signUp"/>
          </div>
      </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
export default {
  name: 'signin',

  data () {
    return {
      asErrorPass: false,
      asErrorMail: false,
      erro: '',
      isPwd: true,
      email: '',
      password: ''
    }
  },

  methods: {
    animate () {
      const element = document.querySelector('.create')
      element.classList.add('animate__animated', 'animate__bounceOut')
      element.addEventListener('animationend', () => {
        this.$router.replace({ name: 'login' })
      })
    },

    signUp () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$q.notify({
            message: 'Bem-vindo ao space Clicker!',
            color: 'positive'
          })
          return this.animate()
        },
        (error) => {
          console.log(error.code)
          if (error.code === 'auth/weak-password') {
            this.asErrorPass = true
            this.asErrorMail = false
            this.erro = error.message
          } else {
            this.asErrorMail = true
            this.erro = error.message
          }
        }
      )
    }
  }

}

</script>
