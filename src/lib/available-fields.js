import FieldTypes from './field-types'
import PrefillTypes from './prefill-types'

export default [
  {
    ...FieldTypes.TITLE,
    prefill: {
      available: [
        PrefillTypes.EMPTY,
        PrefillTypes.PAGE_TITLE,
        PrefillTypes.USER_DEFINED
      ],
      selected: PrefillTypes.PAGE_TITLE,
      value: null
    }
  },
  {
    ...FieldTypes.DESCRIPTION,
    prefill: {
      available: [
        PrefillTypes.EMPTY,
        PrefillTypes.PAGE_URL,
        PrefillTypes.USER_DEFINED
      ],
      selected: PrefillTypes.PAGE_URL,
      value: null
    }
  },
  {
    ...FieldTypes.BOARD_LIST,
    prefill: {
      available: [
        PrefillTypes.BOARD_LIST_LAST_USED,
        PrefillTypes.BOARD_LIST_CHOOSE
      ],
      selected: PrefillTypes.BOARD_LIST_LAST_USED,
      value: null
    }
  },
  {
    ...FieldTypes.POSITION,
    prefill: {
      available: [
        PrefillTypes.POSITION_TOP,
        PrefillTypes.POSITION_BOTTOM
      ],
      selected: PrefillTypes.POSITION_BOTTOM,
      value: null
    }
  },
  {
    ...FieldTypes.DUE_DATE,
    prefill: {
      available: [
        PrefillTypes.CURRENT_DATE,
        PrefillTypes.CHOOSE_DATE
      ],
      selected: PrefillTypes.CURRENT_DATE,
      value: null
    }
  }
]
