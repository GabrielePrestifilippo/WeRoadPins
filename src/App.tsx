import React, { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { fabric } from 'fabric'
import styles from './App.module.css'

import logo from './assets/wrx_bottom.png'
import {
  downloadImage,
  addLocalImage,
  addText,
  getCircle,
  setCanvasSize,
  getDropFile,
} from './utilities'
import DownloadButton from './components/DownloadButton/DownloadButton'

function App() {
  const [uploadedImage, setUploadedImage] = useState<fabric.Image | null>(null)
  const [bottomLogo, setBottomLogo] = useState<fabric.Image | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<fabric.StaticCanvas | null>(null)
  const [preview, setPreview] = useState<fabric.Circle | null>(null)

  const setElementsOrder = () => {
    bottomLogo?.bringToFront()
    preview?.bringToFront()
  }

  const onDrop = (acceptedFiles: File[]) => {
    const acceptedImage = acceptedFiles[0]
    if (!acceptedImage) return null

    getDropFile(acceptedImage).then((imageUrl: string) => {
      if (!fabricCanvas) return
      if (uploadedImage) fabricCanvas?.remove(uploadedImage)

      addLocalImage(fabricCanvas, imageUrl).then((image: fabric.Image) => {
        image.scaleToWidth(2000)
        image.scaleToHeight(2000)
        setUploadedImage(image)
        fabricCanvas.add(image)

        addText(fabricCanvas)
        setElementsOrder()
      })
    })
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const showPreview = (canvas: fabric.StaticCanvas) => {
    const circlePreview = getCircle()
    setPreview(circlePreview)
    canvas.add(circlePreview)
  }

  const attachCanvas = (canvas: HTMLCanvasElement) => {
    const newFabricCanvas = new fabric.StaticCanvas(canvas, {
      selection: false,
      interactive: false,
      width: 2000,
      height: 2000,
      backgroundColor: 'black',
    })

    fabric.Object.prototype.lockMovementX = true
    fabric.Object.prototype.lockMovementY = true
    fabric.Object.prototype.hoverCursor = 'default'

    setFabricCanvas(newFabricCanvas)
  }

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return
    attachCanvas(canvas)
  }, [])

  useEffect(() => {
    if (!fabricCanvas || !canvasRef.current) return

    setCanvasSize(canvasRef.current)

    addLocalImage(fabricCanvas, logo).then((image: fabric.Image) => {
      setBottomLogo(image)
      image.scaleToWidth(2000)
      showPreview(fabricCanvas)
    })
  }, [fabricCanvas])

  const download = () => downloadImage(fabricCanvas)

  return (
    <div className="App">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select</p>
      </div>
      <div className={styles.wrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <DownloadButton onClick={download} />
    </div>
  )
}

export default App
