import React, { useState } from 'react'
import classes from './ImagesEditor.module.css'

type Props = {
  uploadedImages: fabric.Image[]
  render: () => void
}
const ImagesEditor = (props: Props) => {
  const [imagesPosition, setImagesPosition] = useState<number[][]>([])

  const { uploadedImages, render } = props
  if (!uploadedImages.length) return null

  return (
    <>
      {uploadedImages.map((uploadedImage, index) => {
        if (!uploadedImage.width || !uploadedImage.height) return null
        const onSliderChange = (evt: any, isX: boolean) => {
          const change = Number(evt.target.value)
          if (uploadedImage && change) {
            const newImagesPosition = [...imagesPosition]
            const [currentX, currentY] = imagesPosition[index] || [0, 0]

            if (isX) {
              newImagesPosition[index] = [change, currentY]
              uploadedImage.left = change
            } else {
              newImagesPosition[index] = [currentX, change]
              uploadedImage.top = change
            }

            setImagesPosition(newImagesPosition)
            render()
          }
        }
        const width = imagesPosition[index] ? imagesPosition[index][0] : 0
        const height = imagesPosition[index] ? imagesPosition[index][1] : 0

        return (
          <div key={index} className={classes.root}>
            <img src={uploadedImage.getSrc()} width={100} className={classes.image} />

            <input
              className={classes.horizontalSlider}
              type="range"
              min={uploadedImage.width * -1.4}
              max={uploadedImage.width}
              value={width}
              onChange={(evt) => onSliderChange(evt, true)}
            />
            <input
              className={classes.verticalSlider}
              type="range"
              min={uploadedImage.height * -1.4}
              max={uploadedImage.height}
              value={height}
              onChange={(evt) => onSliderChange(evt, false)}
            />
          </div>
        )
      })}
    </>
  )
}

export default ImagesEditor
