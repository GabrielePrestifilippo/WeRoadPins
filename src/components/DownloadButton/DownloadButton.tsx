import React from 'react'

import styles from './DownloadButton.module.css'

type DownloadButtonProps = {
  onClick: () => void
}
const DownloadButton = (props: DownloadButtonProps) => {
  return (
    <div className={styles.root} onClick={props.onClick}>
      Download Image
    </div>
  )
}

export default DownloadButton
