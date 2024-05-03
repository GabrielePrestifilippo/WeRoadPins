import * as React from 'react'
import PopoverMui from '@mui/material/Popover'
import InfoIcon from '@mui/icons-material/Info'

import Button from '@mui/material/Button'

import pins from '../../assets/pins.jpeg'
import { Card, Chip, IconButton, Typography } from '@mui/material'

const Popover = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <IconButton aria-label="info" onClick={handleClick}>
        <InfoIcon />
      </IconButton>

      <PopoverMui
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ flex: 1 }}
      >
        <Card sx={{ padding: 2 }}>
          <Typography component="div" sx={{ flexGrow: 1 }}>
            Make some pins like these
          </Typography>
          <img src={pins} width={300} />
          <Typography component="div" sx={{ flexGrow: 1 }}>
            Read more on{' '}
            <a
              href="https://wecoordi.weroad.travel/c/italian-community/spillette-personalizzate"
              target="_blank"
              rel="noreferrer"
            >
              WeCoordi
            </a>
          </Typography>
        </Card>
      </PopoverMui>
    </div>
  )
}

export default Popover
