<template>
  <q-layout view="hHh LpR lFr">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      menuToolbar: 'home'
    }
  }
}
</script>
