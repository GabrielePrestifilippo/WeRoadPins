import React, { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { fabric } from 'fabric'
import classes from './App.module.css'

import classnames from 'classnames'

import wrx_bottom from './assets/wrx_bottom.png'
import wrx_diagonal from './assets/wrx_diagonal.png'
import wrx_diagonal_bottom from './assets/wrx_diagonal_bottom.png'
import wr_classic from './assets/wr_classic.png'

const footers = [wrx_bottom, wrx_diagonal, wrx_diagonal_bottom, wr_classic]

import italian_flag from './assets/italian_flag.png'
import diagonal_band from './assets/diagonal_band.png'

import {
  downloadImage,
  addLocalImage,
  addText,
  getCircle,
  setCanvasSize,
  getDropFile,
} from './utilities'
import DownloadButton from './components/DownloadButton/DownloadButton'
import ImagesEditor from './components/ImagesEditor/ImagesEditor'

function App() {
  const [uploadedImages, setUploadedImages] = useState<fabric.Image[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<fabric.StaticCanvas | null>(null)
  const [preview, setPreview] = useState<fabric.Circle | null>(null)

  const [bottomLogo, setBottomLogo] = useState<fabric.Image | null>()
  const [selectedFooter, setSelectedFooter] = useState(footers[0])

  const [selectedBand, setSelectedBand] = useState<fabric.Image | null>()
  const [bandImage, setBandImage] = useState<string | null>(null)
  const [diagonalText, setDiagonalText] = useState<fabric.Group | null>(null)

  const [whiteInput, setWhiteInput] = useState('')
  const [redInput, setRedInput] = useState('')

  useEffect(() => {
    uploadedImages.forEach((image) => image.bringToFront())
    selectedBand?.bringToFront()
    bottomLogo?.bringToFront()
    diagonalText?.bringToFront()
    preview?.bringToFront()
  }, [bottomLogo, preview, diagonalText, uploadedImages.length])

  const onDrop = (acceptedFiles: File[]) => {
    const acceptedImage = acceptedFiles[0]
    if (!acceptedImage) return null

    getDropFile(acceptedImage).then((imageUrl: string) => {
      if (!fabricCanvas) return

      addLocalImage(fabricCanvas, imageUrl).then((image: fabric.Image) => {
        image.scaleToWidth(2000)
        image.scaleToHeight(2000)
        fabricCanvas.centerObject(image)
        setUploadedImages([...uploadedImages, image])
        fabricCanvas.add(image)
      })
    })
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const showPreview = (canvas: fabric.StaticCanvas) => {
    const circlePreview = getCircle()
    setPreview(circlePreview)
    if (preview) canvas.remove(preview)
    canvas.add(circlePreview)
  }

  const attachCanvas = (canvas: HTMLCanvasElement) => {
    const newFabricCanvas = new fabric.StaticCanvas(canvas, {
      selectionKey: 'shiftKey',
      width: 2000,
      height: 2000,
      backgroundColor: 'black',
    })

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
    setFooterImage(wrx_bottom)
  }, [fabricCanvas])

  const download = () => {
    if (preview) fabricCanvas?.remove(preview)
    downloadImage(fabricCanvas)
    fabricCanvas && showPreview(fabricCanvas)
  }

  const setFooterImage = (logo: string) => {
    if (!fabricCanvas) return
    if (bottomLogo) fabricCanvas.remove(bottomLogo)

    addLocalImage(fabricCanvas, logo).then((image: fabric.Image) => {
      setBottomLogo(image)
      image.scaleToWidth(2000)
      showPreview(fabricCanvas)
    })
  }
  const setBand = (logo: string) => {
    if (!fabricCanvas) return
    if (selectedBand) fabricCanvas.remove(selectedBand)

    addLocalImage(fabricCanvas, logo).then((image: fabric.Image) => {
      setSelectedBand(image)
      image.scaleToWidth(2000)
      showPreview(fabricCanvas)
    })
  }

  const renderFooters = () => {
    return footers.map((footer) => {
      const className = classnames(
        classes.buttonLogo,
        footer === selectedFooter ? classes.selected : null,
      )

      const setFooter = () => {
        setFooterImage(footer)
        setSelectedFooter(footer)
      }
      return <img key={footer} src={footer} className={className} onClick={setFooter} />
    })
  }

  const renderAdditionalElements = () => {
    if (!fabricCanvas) return null

    const setItalian = () => {
      if (diagonalText) fabricCanvas.remove(diagonalText)
      if (bandImage === italian_flag && selectedBand) {
        fabricCanvas.remove(selectedBand)
        setSelectedBand(null)
        setBandImage(null)
      } else {
        setBandImage(italian_flag)
        setBand(italian_flag)
      }
    }
    const setDiagonal = () => {
      if (diagonalText) fabricCanvas.remove(diagonalText)

      if (bandImage === diagonal_band && selectedBand) {
        fabricCanvas.remove(selectedBand)
        setSelectedBand(null)
        setBandImage(null)
        fabricCanvas.remove(selectedBand)
      } else {
        setBandImage(diagonal_band)
        setBand(diagonal_band)
        const addedText = addText(fabricCanvas, redInput, whiteInput)
        setDiagonalText(addedText)
      }
    }

    const italianClassName = classnames(
      classes.buttonLogo,
      bandImage === italian_flag ? classes.selected : null,
    )
    const diagonalClassName = classnames(
      classes.buttonLogo,
      bandImage === diagonal_band ? classes.selected : null,
    )

    return (
      <>
        <img src={italian_flag} className={italianClassName} onClick={setItalian} />
        <img src={diagonal_band} className={diagonalClassName} onClick={setDiagonal} />
      </>
    )
  }

  return (
    <div className="App">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select</p>
      </div>
      <div className={classes.wrapper}>
        <canvas ref={canvasRef} className={classes.canvas} />
      </div>
      <ImagesEditor uploadedImages={uploadedImages} render={() => fabricCanvas?.renderAll()} />

      <DownloadButton onClick={download} />
      {renderFooters()}
      {renderAdditionalElements()}
      <p>red</p>
      <input value={redInput} onChange={(evt) => setRedInput(evt.target.value)} />
      <p>white</p>
      <input value={whiteInput} onChange={(evt) => setWhiteInput(evt.target.value)} />
    </div>
  )
}

export default App
