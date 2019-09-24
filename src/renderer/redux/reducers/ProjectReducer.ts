import _ from 'lodash'
import {
  ProjectState,
  ProjectAction,
  NEW_PROJECT,
  EDIT_PROJECT,
  DELETE_PROJECT,
  OPEN_PROJECT,
  CLOSE_PROJECT,
} from '../types/ProjectTypes'

const initialState: ProjectState = {
  openProject: null,
  projects: [],
}

export function projectReducer(state = initialState, action: ProjectAction): ProjectState {
  const nextState = _.clone(state)
  switch (action.type) {
    case NEW_PROJECT: {
      nextState.projects.push(action.payload)
      break
    }
    case EDIT_PROJECT: {
      const { projectDir } = action.payload
      const editedProject = _.find(nextState.projects, (project) => project.projectDir === projectDir)
      if (!editedProject) {
        throw new Error('Could not find project')
      } else {
        editedProject.name = action.payload.name
      }
      break
    }
    case DELETE_PROJECT: {
      const { projectDir } = action.payload
      const newProjects = _.filter(state.projects, (project) => project.projectDir === projectDir)
      nextState.projects = newProjects
      break
    }
    case OPEN_PROJECT: {
      const { projectDir } = action.payload
      const openProject = _.find(state.projects, (project) => project.projectDir === projectDir)
      if (!openProject) {
        throw new Error('Could not find project')
      } else {
        nextState.openProject = openProject
      }
      break
    }
    case CLOSE_PROJECT: {
      nextState.openProject = null
      break
    }
    default:
      break
  }
  return nextState
}
