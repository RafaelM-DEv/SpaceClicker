<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated style="display: none;" >
      <q-toolbar class="font">

        <q-toolbar-title style="font-size: 10px;">
         Poeira Cósmica:  {{ Math.round( cosmicDustCount) }}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>
<!--
    <q-drawer
      hidden
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Vue from 'vue'
import gsap from 'gsap'
// import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default {
  name: 'MainLayout',
  // components: { EssentialLink },
  data () {
    return {
      dust: Vue.prototype.$cosmicDust,
      cosmicDustCount: 0,
      leftDrawerOpen: false,
      essentialLinks: linksData,
      version: '1.2.3',
      game: {
        cosmicDust: 0
      }
    }
  },
  computed: {
    animatedNumber () {
      return this.game.cosmicDust
    }
  },

  watch: {
    animatedNumber (newValue) {
      gsap.to(this.$data, { duration: 1.8, cosmicDustCount: newValue })
    }
  }

  // created () {
  //   this.getGame()
  // },

  // mounted () {
  //   if (localStorage.getItem(this.version)) {
  //     try {
  //       this.game = JSON.parse(localStorage.getItem(this.version))
  //     } catch (e) {
  //       // localStorage.removeItem('game-1.2.0')
  //       console.log(e)
  //     }
  //   }
  // },

  // methods: {
  //   getGame () {
  //     setInterval(() => {
  //       this.game = JSON.parse(localStorage.getItem(this.version))
  //     }, 1000)
  //   }
  // }

}
</script>
