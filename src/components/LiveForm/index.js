import React from 'react'
import { connect } from 'react-redux'
import LiveForm from './LiveForm'

const mapStateToProps = ({ fields }) => ({
  fields: fields.selected
})

const mapDispatchToProps = dispatch => {
  return {
    //
  }
}

export default connect(mapStateToProps)(LiveForm)
