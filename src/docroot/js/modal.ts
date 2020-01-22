import Vue from 'vue'

interface Data {
  photos: any[]
  selectedPhotoId: number | undefined
  isShownModal: boolean
}

const vm = new Vue({
  el: '#app',
  data(): Data {
    return {
      photos: [],
      selectedPhotoId: undefined,
      isShownModal: false
    }
  },
  computed: {
    target(): any | undefined {
      if (this.selectedPhotoId === undefined) {
        return undefined
      }

      return this.photos.find(
        (photo: any): any => photo.id === this.selectedPhotoId
      )
    }
  },
  created(): void {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((res: Response): Promise<any> => res.json())
      .then((result: any): void => {
        this.photos = result.slice(0, 100)
      })
  },
  methods: {
    onClick(photoId: number): void {
      this.isShownModal = true
      this.selectedPhotoId = photoId
    },
    onClickPrev(): void {
      const prevPhotoIndex: number =
        this.photos.findIndex(photo => photo.id === this.selectedPhotoId) - 1

      this.selectedPhotoId = this.photos[
        prevPhotoIndex < 0 ? this.photos.length - 1 : prevPhotoIndex
      ].id
    },
    onClickNext(): void {
      const nextPhotoIndex: number =
        this.photos.findIndex(photo => photo.id === this.selectedPhotoId) + 1
      this.selectedPhotoId = this.photos[
        nextPhotoIndex > this.photos.length - 1 ? 0 : nextPhotoIndex
      ].id
    }
  }
})

console.log(vm)
