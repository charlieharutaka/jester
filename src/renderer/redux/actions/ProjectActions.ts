import {
  ProjectAction,
  NEW_PROJECT,
  EDIT_PROJECT,
  DELETE_PROJECT,
  OPEN_PROJECT,
  CLOSE_PROJECT,
} from '../types/ProjectTypes'

export function newProject(projectDir: string, name: string): ProjectAction {
  return {
    type: NEW_PROJECT,
    payload: {
      projectDir,
      name,
    },
  }
}

export function editProject(projectDir: string, name: string): ProjectAction {
  return {
    type: EDIT_PROJECT,
    payload: {
      projectDir,
      name,
    },
  }
}

export function deleteProject(projectDir: string): ProjectAction {
  return {
    type: DELETE_PROJECT,
    payload: {
      projectDir,
    },
  }
}

export function openProject(projectDir: string): ProjectAction {
  return {
    type: OPEN_PROJECT,
    payload: {
      projectDir,
    },
  }
}

export function closeProject(projectDir: string): ProjectAction {
  return {
    type: CLOSE_PROJECT,
  }
}
