import _ from 'lodash'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import { randomPatternStyle } from './Pattern'

interface GridCardProps {
  newProjectCard?: boolean
  projectName?: string
  projectDir?: string
  onClick?: (event?: React.SyntheticEvent) => void
}

const useStyles = makeStyles((theme) => ({
  card: {
    width: '240px',
    height: '336px',
    borderRadius: '10px',
    transition: 'box-shadow 100ms ease-in',
    wordBreaky: 'break-word',
    overflow: 'hidden',
  },
  cardGraphic: {
    height: '240px',
    overflow: 'hidden',
  },
  cardInfo: {
    height: `calc(96px - ${2 * theme.spacing(2)}px)`,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'start',
  },
  innerDiv: {
    width: '100%',
  },
  dir: {
    fontSize: '11pt',
    fontFamily: 'Roboto',
    fontWeight: 300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  name: {
    fontSize: '21pt',
    fontFamily: 'Abril Fatface',
    fontStyle: 'italic',
  },
  icon: {
    fontSize: '120pt',
    marginBotton: '30px',
    fontFamily: 'Roboto',
    fontWeight: 100,
  },
}))

const GridCard: React.FunctionComponent<GridCardProps> = ({ newProjectCard, projectName, projectDir, onClick }) => {
  const classes = useStyles()
  const [hover, setHover] = React.useState<boolean>(false)
  const [pattern, setPattern] = React.useState<object>(randomPatternStyle('c21325'))
  const handleHover = (state: boolean) => () => setHover(state)
  return (
    <Grid item xs="auto">
      <Paper
        className={classes.card}
        onClick={onClick || _.noop}
        elevation={hover ? 12 : 4}
        onMouseOver={handleHover(true)}
        onMouseOut={handleHover(false)}
      >
        <div className={classes.cardGraphic} style={pattern}></div>
        <div className={classes.cardInfo}>
          {newProjectCard ? (
            <div className={classes.innerDiv}>
              <Typography className={classes.name}>New Project</Typography>
            </div>
          ) : (
            <div className={classes.innerDiv}>
              <Tooltip title={projectDir} enterDelay={300}>
                <Typography className={classes.dir}>{projectDir}</Typography>
              </Tooltip>
              <Typography className={classes.name}>{projectName}</Typography>
            </div>
          )}
        </div>
      </Paper>
    </Grid>
  )
}

export default GridCard
