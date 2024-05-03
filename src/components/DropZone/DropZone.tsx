import React from 'react'
import classes from './DropZone.module.css'
import { Box, CardContent, Typography } from '@mui/material'
import { getDropFile } from '../../utilities'
import { useDropzone } from 'react-dropzone'

type Props = {
  onImageAdd: (image: string) => void
}

const DropZone = (props: Props) => {
  const { onImageAdd } = props

  const onDrop = (acceptedFiles: File[]) => {
    const acceptedImage = acceptedFiles[0]
    if (!acceptedImage) return null

    getDropFile(acceptedImage).then((imageUrl: string) => {
      onImageAdd(imageUrl)
    })
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      <CardContent {...getRootProps()}>
        <input {...getInputProps()} />
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Drag & drop an image here, or click to select a local image. <br />
          Recommended size 2000*2000
        </Typography>
      </CardContent>
    </Box>
  )
}

export default DropZone
