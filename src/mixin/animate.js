export const animate = {
  methods: {
    animate (model) {
      const element = document.querySelector('.create')

      element.classList.add('animate__animated', 'animate__bounceOut')
      element.addEventListener('animationend', () => {
        this.$router.replace({ name: model })
      })
    }
  }
}
