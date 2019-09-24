import React from 'react'
import { ReduxState } from '../../redux/reducers/RootReducer'
import { setResult, updateResult, clearResult } from '../../redux/actions/ResultActions'
import { newProject, editProject, deleteProject, openProject } from '../../redux/actions/ProjectActions'
import { Modals } from '../../redux/types/ModalTypes'
import { openModal, closeModal } from '../../redux/actions/ModalActions'
import { Project } from '../../redux/types/ProjectTypes'
import { AggregatedResult, TestResult } from '@jest/test-result'
import { Dispatch } from 'redux'
import { Test } from '@jest/reporters/build/types'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { connect } from 'react-redux'

import GridCard from './GridCard'

function mapStateToProps(state: ReduxState) {
  return state
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setResult: (project: string, aggregatedResult: AggregatedResult) => {
      dispatch(setResult(project, aggregatedResult))
    },
    updateResult: (project: string, test: Test, result: TestResult) => {
      dispatch(updateResult(project, test, result))
    },
    clearResult: (project: string) => {
      dispatch(clearResult(project))
    },
    newProject: (project: string, name: string) => {
      dispatch(newProject(project, name))
    },
    editProject: (project: string, name: string) => {
      dispatch(editProject(project, name))
    },
    deleteProject: (project: string) => {
      dispatch(deleteProject(project))
    },
    openProject: (project: string) => {
      dispatch(openProject(project))
    },
    openModal: (modal: Modals) => {
      dispatch(openModal(modal))
    },
    closeModal: (modal: Modals) => {
      dispatch(closeModal(modal))
    },
  }
}

type OverviewProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const useStyles = makeStyles({
  projectSubtitle: {
    fontSize: '14pt',
    fontFamily: 'Roboto',
    fontWeight: 300,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },
  cards: {
    marginTop: '30px',
  },
})

const Overview: React.FunctionComponent<OverviewProps> = (props) => {
  const classes = useStyles()
  const newProject = () => {
    props.openModal('newProjectModal')
  }
  return (
    <div>
      <Typography className={classes.projectSubtitle}>Projects</Typography>
      <div className={classes.cards}>
        <Grid container spacing={4}>
          {props.project.projects.map((project: Project, index: number) => {
            return <GridCard projectDir={project.projectDir} projectName={project.name} key={index} />
          })}
          <GridCard newProjectCard onClick={newProject} />
        </Grid>
      </div>
    </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Overview)
