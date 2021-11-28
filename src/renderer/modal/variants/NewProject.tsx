import React from 'react'
import { Dispatch } from 'redux'
import { newProject } from '../../redux/actions/ProjectActions'
import { connect } from 'react-redux'
import { closeModal } from '../../redux/actions/ModalActions'
import { dialog } from '@electron/remote'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import FolderIcon from '@mui/icons-material/Folder'

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    newProject(projectDir: string, name: string) {
      dispatch(newProject(projectDir, name))
    },
    closeModal() {
      dispatch(closeModal('newProjectModal'))
    },
  }
}

type NewProjectProps = ReturnType<typeof mapDispatchToProps>

const NewProject: React.FunctionComponent<NewProjectProps> = ({ newProject, closeModal }) => {
  const [directory, setDirectory] = React.useState<string>('')
  const [directoryError, setDirectoryError] = React.useState<string | undefined>(undefined)
  const [name, setName] = React.useState<string>('')
  const [nameError, setNameError] = React.useState<string | undefined>(undefined)
  function clearErrors() {
    if (directoryError) setDirectoryError(undefined)
    if (nameError) setNameError(undefined)
  }
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      clearErrors()
      setter(event.currentTarget.value)
    }
  const handleSubmit = () => {
    if (directory === '') {
      setDirectoryError('This field is required')
    } else {
      newProject(directory, name)
    }
  }
  const handleDirectoryChoice = () => {
    dialog
      .showOpenDialog({
        properties: ['openDirectory'],
      })
      .then((path) => {
        const directory = (path.filePaths || [''])[0]
        const isWin32 = window.navigator.platform === 'Win32' || window.navigator.platform === 'Win64'
        setDirectory(directory)
        const dirname = isWin32
          ? directory.slice(directory.lastIndexOf('\\') + 1)
          : directory.slice(directory.lastIndexOf('/') + 1)
        setName(dirname)
      })
  }
  return (
    <div>
      <DialogTitle>New Project</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: 'flex',
          }}
        >
          <TextField
            label="Project Directory"
            fullWidth
            value={directory}
            required
            onChange={handleChange(setDirectory)}
            variant="outlined"
            error={directoryError !== undefined}
            helperText={directoryError}
          />
          <Button
            variant="outlined"
            style={{
              marginLeft: '10px',
            }}
            onClick={handleDirectoryChoice}
          >
            <FolderIcon />
          </Button>
        </div>
        <TextField
          label="Project Name"
          fullWidth
          value={name}
          onChange={handleChange(setName)}
          variant="outlined"
          margin="normal"
          error={nameError !== undefined}
          helperText={nameError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Cancel</Button>
        <Button variant="outlined" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(NewProject)
