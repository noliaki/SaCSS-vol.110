import Vue from 'vue'

interface Data {
  posts: any[]
}

function nextFrame(cb: () => void): void {
  window.requestAnimationFrame(() => window.requestAnimationFrame(cb))
}

const ThePostsItem = Vue.component('template-posts-item', {
  template: '#template-posts-item',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isShownBody: false
    }
  },
  methods: {
    enter(el: HTMLElement): void {
      el.style.overflow = 'hidden'
      const height: number = el.scrollHeight
      el.style.height = '0'

      nextFrame((): void => {
        el.style.height = `${height}px`
      })
    },
    leave(el: HTMLElement): void {
      el.style.overflow = 'hidden'
      el.style.height = `${el.scrollHeight}px`

      nextFrame((): void => {
        el.style.height = '0px'
      })
    },
    afterTransition(el: HTMLElement): void {
      el.style.overflow = ''
      el.style.height = ''
    }
  }
})

const vm = new Vue({
  el: '#app',
  components: {
    ThePostsItem
  },
  data(): Data {
    return {
      posts: []
    }
  },
  created(): void {
    fetch('./disclosure-item.json')
      .then((res: Response): Promise<any> => res.json())
      .then((result: any): void => {
        this.posts = result.slice(0, 100)
      })
  }
})

console.log(vm)
