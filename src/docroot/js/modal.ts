import Vue from 'vue'

interface Data {
  photos: any[]
}

const vm = new Vue({
  el: '#app',
  data(): Data {
    return {
      photos: []
    }
  },
  created(): void {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((res: Response): Promise<any> => res.json())
      .then((result: any): void => {
        this.photos = result.slice(0, 100)
      })
  }
})

console.log(vm)
