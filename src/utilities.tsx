import { fabric } from 'fabric'

export const downloadImage = (fabricCanvas: fabric.StaticCanvas | null) => {
  if (!fabricCanvas) return

  const dataURL = fabricCanvas.toDataURL({ format: 'image/png' })

  const link = document.createElement('a')
  link.href = dataURL
  link.download = 'immaginePin38mm.png'
  link.click()
}

export const addLocalImage = (fabricCanvas: fabric.StaticCanvas, localImagePath: string) => {
  type ImageSetter = (image: fabric.Image) => void
  return new Promise((res: ImageSetter) => {
    fabric.Image.fromURL(localImagePath, (img) => {
      fabricCanvas.add(img)
      fabricCanvas.renderAll()
      res(img)
    })
  })
}

export const addText = (canvas: fabric.StaticCanvas) => {
  const fontToLoad = 'Gilroy' // Replace with your font name

  const text1 = new fabric.Text('Red', {
    fontSize: 60,
    fill: 'red',
    charSpacing: 10,
    fontFamily: fontToLoad,
  })

  const group = new fabric.Group([text1], {
    top: 400,
  })

  const whiteText = new fabric.Text('White', {
    fontSize: 60,
    fill: 'white',
    charSpacing: 10,
    fontFamily: fontToLoad,
    left: (group.get('width') || 0) + 5,
    top: group.get('top'),
    originX: 'left',
    originY: 'top',
  })
  group.addWithUpdate(whiteText)

  group.angle = -45
  canvas.add(group)
  canvas.renderAll()
}

export const getCircle = () => {
  const circle = new fabric.Circle({
    radius: 1000,
    fill: 'white',
    opacity: 0.2,
    stroke: 'white',
    strokeWidth: 3,
    left: 0,
  })
  return circle
}

export const setCanvasSize = (canvasElement: HTMLCanvasElement) => {
  if (canvasElement) {
    canvasElement.style.transform =
      'scale(' +
      1 /
        Math.max(
          Math.max(
            (canvasElement.clientWidth / window.innerWidth) * 1.2,
            (canvasElement.clientHeight / window.innerHeight) * 1.2,
          ),
          3,
        ) +
      ')'
  }
}

export const getDropFile = (acceptedImage: Blob) => {
  type ImageLoader = (path: string) => void
  return new Promise((res: ImageLoader) => {
    if (!acceptedImage) return null

    const reader = new FileReader()
    reader.readAsDataURL(acceptedImage)

    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      res(imageUrl)
    }
  })
}
