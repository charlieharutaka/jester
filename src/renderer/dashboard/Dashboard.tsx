import React from 'react'

import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography'
import Overview from './overview/Overview'
import Modal from '../modal/Modal'

const useStyles = makeStyles({
  view: {
    margin: '30px',
  },
  jesterTitle: {
    fontFamily: 'Abril Fatface',
    fontSize: '48pt',
    fontStyle: 'italic',
  },
})

const Dashboard: React.FunctionComponent<{}> = () => {
  const classes = useStyles()
  return (
    <div className="app">
      <div className={classes.view}>
        <Typography className={classes.jesterTitle}>Jester</Typography>
        <Overview />
      </div>
      <Modal />
    </div>
  )
}

export default Dashboard
