import update from 'immutability-helper'
import availableFields from '../../lib/available-fields'

export const FIELDS_MOVE = 'FIELDS_MOVE'
export const moveField = (dragIndex, hoverIndex) => ({
  type: FIELDS_MOVE,
  dragIndex,
  hoverIndex
})

export const FIELDS_ADD = 'FIELDS_ADD'
export const addField = id => ({
  type: FIELDS_ADD,
  id
})

export const FIELDS_REMOVE = 'FIELDS_REMOVE'
export const removeField = id => ({
  type: FIELDS_REMOVE,
  id
})

export const FIELDS_UPDATE_PREFILL = 'FIELDS_UPDATE_PREFILL'
export const updatePrefill = (id, prefill) => ({
  type: FIELDS_UPDATE_PREFILL,
  id,
  prefill
})

const initialState = {
  selected: availableFields.slice(0, 3), // start with the first 3 fields
  available: availableFields
}

export default function fields (state = initialState, action) {
  switch (action.type) {
    case FIELDS_ADD:
      const field = state.available.find(f => f.id === action.id)
      if (!field) return state

      return update(state, {
        selected: {
          $push: [field]
        }
      })
    case FIELDS_REMOVE:
      const { selected } = state
      const indexToRemove = selected.map(field => field.id).indexOf(action.id)
      if (indexToRemove === -1) return state

      return update(state, {
        selected: {
          $splice: [
            [indexToRemove, 1]
          ]
        }
      })
    case FIELDS_MOVE:
      const dragField = state.selected[action.dragIndex]
      return update(state, {
        selected: {
          $splice: [
            [action.dragIndex, 1],
            [action.hoverIndex, 0, dragField]
          ]
        }
      })
    case FIELDS_UPDATE_PREFILL:
      return update(state, {
        selected: {
          $apply: fields => fields.map(field => {
            if (field.id !== action.id) return field
            // TODO: clear out `value` when it's not being used
            return {
              ...field,
              prefill: action.prefill
            }
          })
        }
      })
    default:
      return state
  }
}
