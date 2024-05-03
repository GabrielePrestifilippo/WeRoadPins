import React, { useState, useRef, useEffect } from 'react'

import { fabric } from 'fabric'
import classes from './App.module.css'
import {
  AccordionDetails,
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'

import wrx_bottom from './assets/wrx_bottom.png'
import wrx_diagonal from './assets/wrx_diagonal.png'
import wrx_diagonal_bottom from './assets/wrx_diagonal_bottom.png'
import wr_classic from './assets/wr_classic.png'

const footers = [wrx_bottom, wrx_diagonal, wrx_diagonal_bottom, wr_classic]

import italian_flag from './assets/italian_flag.png'
import diagonal_band from './assets/diagonal_band.png'

import { downloadImage, addLocalImage, addText, getCircle, setCanvasSize } from './utilities'

import ImagesEditor from './components/ImagesEditor/ImagesEditor'
import DropZone from './components/DropZone/DropZone'
import TabPanel from './components/TabPanel/TabPanel'
import Popover from './components/Popover/Popover'

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

  const [redInput, setRedInput] = useState('     We')
  const [whiteInput, setWhiteInput] = useState('Road')

  const [value, setValue] = React.useState(0)

  useEffect(() => {
    uploadedImages.forEach((image) => image.bringToFront())
    selectedBand?.bringToFront()
    bottomLogo?.bringToFront()
    diagonalText?.bringToFront()
    preview?.bringToFront()
  }, [bottomLogo, preview, diagonalText, uploadedImages.length])

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
    return (
      <Grid container spacing={2} display="flex" wrap="wrap">
        {footers.map((footer) => {
          const setFooter = () => {
            setFooterImage(footer)
            setSelectedFooter(footer)
          }
          return (
            <Card
              key={footer}
              sx={{ bgcolor: footer === selectedFooter ? '#f4f8f5' : 'white', margin: 1 }}
              onClick={setFooter}
            >
              <CardContent>
                <img key={footer} src={footer} className={classes.buttonLogo} />
              </CardContent>
            </Card>
          )
        })}
      </Grid>
    )
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

    return (
      <Grid container spacing={2}>
        <Card sx={{ bgcolor: bandImage === italian_flag ? '#f4f8f5' : 'white', margin: 2 }}>
          <CardHeader subheader="Italian Flag" />
          <CardContent>
            <img src={italian_flag} className={classes.buttonLogo} />
          </CardContent>
          <CardActions>
            <Button size="small" onClick={setItalian}>
              {bandImage === italian_flag ? 'Remove Flag' : 'Add Flag'}
            </Button>
          </CardActions>
        </Card>

        <Card sx={{ bgcolor: bandImage === diagonal_band ? '#f4f8f5' : 'white', margin: 2 }}>
          <CardContent>
            <img src={diagonal_band} className={classes.buttonLogo} />
            <Typography variant="subtitle2">
              Remove and Add to see updated text. <br />
              Add spaces to align the text properly.
            </Typography>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '20ch' },
                marginTop: 2,
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                variant="outlined"
                value={redInput}
                label="Red Text"
                onChange={(evt) => setRedInput(evt.target.value)}
              />
              <TextField
                variant="outlined"
                label="White Text"
                value={whiteInput}
                onChange={(evt) => setWhiteInput(evt.target.value)}
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={setDiagonal}>
              {bandImage === diagonal_band ? 'Remove Text' : 'Add Text'}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }

  const onImageAdd = (imageUrl: string) => {
    if (!fabricCanvas) return null
    addLocalImage(fabricCanvas, imageUrl).then((image: fabric.Image) => {
      image.scaleToWidth(2000)
      image.scaleToHeight(2000)
      fabricCanvas.centerObject(image)
      setUploadedImages([...uploadedImages, image])
      fabricCanvas.add(image)
    })
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <div className={classes.divHeader}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex' }}>
              Pins generator
              <Popover />
            </Typography>
          </div>
          <Button color="inherit" sx={{ marginRight: 2, padding: 1 }} onClick={download}>
            Download Image
          </Button>
          <a href="https://www.buymeacoffee.com/gabrieleprf" target="_blank" rel="noreferrer">
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              style={{ height: '40px' }}
            />
          </a>
        </Toolbar>
      </AppBar>
      <Grid sx={{ padding: 2 }}>
        <Grid display="flex" item xs={12} justifyContent="center" alignItems="center">
          <div className={classes.wrapper}>
            <canvas ref={canvasRef} className={classes.canvas} />
          </div>
        </Grid>

        <Box sx={{ width: '100%', background: 'white' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Background" />
              <Tab label="Footer" />
              <Tab label="Other elements" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Typography>Add one or multiple background images and edit the position</Typography>
            <DropZone onImageAdd={onImageAdd} />
            <ImagesEditor
              uploadedImages={uploadedImages}
              render={() => fabricCanvas?.renderAll()}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AccordionDetails>{renderFooters()}</AccordionDetails>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <AccordionDetails>{renderAdditionalElements()}</AccordionDetails>
          </TabPanel>
          <Button variant="contained" className={classes.button} onClick={download}>
            Download Image
          </Button>
        </Box>
      </Grid>
    </div>
  )
}

export default App
