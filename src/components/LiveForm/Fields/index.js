import FieldTypes from '../../../lib/field-types'
import Text from './Text'
import DatePicker from './DatePicker'
import Dropdown from './Dropdown'

export default field => {
  switch (field.id) {
    case FieldTypes.TITLE.id:
      return Text
    case FieldTypes.DESCRIPTION.id:
      return Text
    case FieldTypes.POSITION.id:
      return Text
    case FieldTypes.DUE_DATE.id:
      return DatePicker
    case FieldTypes.BOARD_LIST.id:
      return Dropdown
    default:
      return null
  }
}
