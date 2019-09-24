import _ from 'lodash'
import React from 'react'
import { ReduxState } from '../redux/reducers/RootReducer'
import { Dispatch } from 'redux'
import { Modals } from '../redux/types/ModalTypes'
import { closeModal, openModal } from '../redux/actions/ModalActions'
import { connect } from 'react-redux'

import Dialog from '@material-ui/core/Dialog'

import NewProject from './variants/NewProject'

function mapStateToProps({ modal }: ReduxState) {
  return {
    modal,
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    openModal: (modal: Modals) => {
      dispatch(openModal(modal))
    },
    closeModal: (modal: Modals) => {
      dispatch(closeModal(modal))
    },
  }
}

type ModalProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const Modal: React.FunctionComponent<ModalProps> = ({ modal, openModal, closeModal }) => {
  const open = _.values(modal).reduce((prev, cur) => prev && cur)
  const currentModal = _.findKey(modal, (val) => val) as Modals | undefined
  if (open && !currentModal) throw new Error('Could not find modal')
  const handleCloseModal = () => {
    if (currentModal) closeModal(currentModal as Modals)
  }

  let modalToDisplay
  switch (currentModal) {
    case 'newProjectModal':
      modalToDisplay = <NewProject />
      break
    default:
      break
  }

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth>
      {modalToDisplay || <div />}
    </Dialog>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Modal)
