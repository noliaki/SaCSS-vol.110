import Vue from 'vue'

interface Data {
  photos: any[]
  selectedPhotoId: number | undefined
  isShownModal: boolean
  detailTransitionName: string
}

const htmlEl: HTMLHtmlElement = document.querySelector('html')
const bodyEl: HTMLBodyElement = document.querySelector('body')
const scrollBarWidth: number = getScrollBarWidth()
const clippedClassName: string = '-clipped'

const vm = new Vue({
  el: '#app',
  data(): Data {
    return {
      photos: [],
      selectedPhotoId: undefined,
      isShownModal: false,
      detailTransitionName: 'noop'
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
  watch: {
    selectedPhotoId(next: undefined | number, prev: undefined | number): void {
      if (next === undefined || prev === undefined) {
        this.detailTransitionName = 'noop'
      } else {
        this.detailTransitionName = 'modal-content'
      }
    }
  },
  created(): void {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((res: Response): Promise<any> => res.json())
      .then((result: any): void => {
        this.photos = result.slice(0, 10)
      })
  },
  methods: {
    onClick(photoId: number): void {
      this.showModal()
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
    },
    showModal(): void {
      this.isShownModal = true
      htmlEl.classList.add(clippedClassName)
      this.addScrollBarWidth()
    },
    hideModal(): void {
      this.isShownModal = false
      htmlEl.classList.remove(clippedClassName)
      this.removeScrollBarWidth()
    },
    addScrollBarWidth(): void {
      if (document.documentElement.clientHeight < bodyEl.scrollHeight) {
        bodyEl.style.paddingRight = `${scrollBarWidth}px`
      }
    },
    removeScrollBarWidth(): void {
      bodyEl.style.paddingRight = ''
    },
    afterLeave(): void {
      this.selectedPhotoId = undefined
    }
  }
})

function getScrollBarWidth(): number {
  const rect: HTMLDivElement = document.createElement('div')
  rect.style.overflow = 'scroll'
  rect.style.position = 'absolute'
  rect.style.top = '-9999px'
  rect.style.width = '50px'
  rect.style.height = '50px'

  document.body.appendChild(rect)
  const scrollbarWidth: number =
    rect.getBoundingClientRect().width - rect.clientWidth
  document.body.removeChild(rect)

  return scrollbarWidth
}

console.log(vm)
