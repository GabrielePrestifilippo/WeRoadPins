import React, { useState } from 'react'
import classes from './ImagesEditor.module.css'
import { Card, CardContent, CardMedia, Grid, Slider, Typography } from '@mui/material'

type Props = {
  uploadedImages: fabric.Image[]
  render: () => void
}
const ImagesEditor = (props: Props) => {
  const [imagesPosition, setImagesPosition] = useState<number[][]>([])
  const [scale, setScale] = useState<number>(80)

  const { uploadedImages, render } = props
  if (!uploadedImages.length) return null

  return (
    <Grid container spacing={2} display="flex" wrap="wrap">
      {uploadedImages.map((uploadedImage, index) => {
        if (!uploadedImage.width || !uploadedImage.height) return null

        const onScaleChange = (evt: any, isX: boolean) => {
          const change = Number(evt.target?.value)
          if (uploadedImage && change) {
            uploadedImage.scaleToHeight((change * 2000) / 80)
            // uploadedImage.scaleY = change / 100
            setScale(change)
            render()
          }
        }
        const onSliderChange = (evt: any, isX: boolean) => {
          const change = Number(evt.target?.value)
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
            <Card sx={{ width: 250 }}>
              <CardMedia sx={{ height: 100 }} image={uploadedImage.getSrc()} />
              {/* <img src={uploadedImage.getSrc()} width={100} className={classes.image} /> */}
              <CardContent>
                <Typography>Horizontal alignment</Typography>
                <Slider
                  className={classes.horizontalSlider}
                  sx={{ width: 100 }}
                  min={uploadedImage.width * -1.4}
                  max={uploadedImage.width}
                  value={width}
                  onChange={(evt) => onSliderChange(evt, true)}
                />
                <Typography>Vertical alignment</Typography>
                <Slider
                  className={classes.verticalSlider}
                  sx={{ width: 100 }}
                  min={uploadedImage.height * -1.4}
                  max={uploadedImage.height}
                  value={height}
                  onChange={(evt) => onSliderChange(evt, false)}
                />
                <Typography>Scale</Typography>
                <Slider
                  className={classes.verticalSlider}
                  sx={{ width: 100 }}
                  min={1}
                  max={100}
                  value={scale}
                  onChange={(evt) => onScaleChange(evt, false)}
                />
              </CardContent>
            </Card>
          </div>
        )
      })}
    </Grid>
  )
}

export default ImagesEditor
