import { ReduxAction } from './RootTypes'

export const NEW_PROJECT = 'NEW_PROJECT'
export const EDIT_PROJECT = 'EDIT_PROJECT'
export const DELETE_PROJECT = 'DELETE_PROJECT'
export const OPEN_PROJECT = 'OPEN_PROJECT'
export const CLOSE_PROJECT = 'CLOSE_PROJECT'

export interface Project {
  projectDir: string
  name: string
}

export interface ProjectState {
  openProject: Project | null
  projects: Project[]
}

type NewProjectAction = ReduxAction<
  typeof NEW_PROJECT,
  {
    projectDir: string
    name: string
  }
>

type EditProjectAction = ReduxAction<
  typeof EDIT_PROJECT,
  {
    projectDir: string
    name: string
  }
>

type DeleteProjectAction = ReduxAction<
  typeof DELETE_PROJECT,
  {
    projectDir: string
  }
>

type OpenProjectAction = ReduxAction<
  typeof OPEN_PROJECT,
  {
    projectDir: string
  }
>

type CloseProjectAction = ReduxAction<typeof CLOSE_PROJECT>

export type ProjectAction =
  | NewProjectAction
  | EditProjectAction
  | DeleteProjectAction
  | OpenProjectAction
  | CloseProjectAction
