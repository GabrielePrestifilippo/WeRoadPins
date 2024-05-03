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

export const addText = (canvas: fabric.StaticCanvas, text1: string, text2: string) => {
  const fontToLoad = 'Gilroy' // Replace with your font name

  const redText = new fabric.Text(text1, {
    fontSize: 180,
    fill: '#ff4758',
    charSpacing: 10,
    fontFamily: fontToLoad,
    stroke: '#ff4758',
    strokeWidth: 5,
  })

  const group = new fabric.Group([redText], {
    top: 900,
    // left: 50,
  })

  const whiteText = new fabric.Text(text2, {
    fontSize: 180,
    fill: 'white',
    charSpacing: 10,
    fontFamily: fontToLoad,
    left: (group.get('width') || 0) + 5,
    top: group.get('top'),
    originX: 'left',
    originY: 'top',
    stroke: '#fff',
    strokeWidth: 5,
  })
  group.addWithUpdate(whiteText)

  group.angle = -45
  canvas.add(group)
  canvas.renderAll()
  return group
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
