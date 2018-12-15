import React, { Component } from 'react'
import { connect } from 'react-redux'
import EditableForm from './EditableForm'
import _ from 'lodash'

import {
  moveField,
  addField,
  removeField,
  updatePrefill
} from '../../redux/modules/fields'

const mapStateToProps = ({ fields }) => ({
  fields: fields.selected,
  available: _.differenceWith(fields.available, fields.selected, _.isEqual)
})

const mapDispatchToProps = dispatch => ({
  moveField (dragIndex, hoverIndex) {
    dispatch(moveField(dragIndex, hoverIndex))
  },
  addField (id) {
    dispatch(addField(id))
  },
  removeField (id) {
    dispatch(removeField(id))
  },
  updatePrefill (id, prefill) {
    dispatch(updatePrefill(id, prefill))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditableForm)
