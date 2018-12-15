import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
// import PrefillTypes from 'libs/prefill-types'
// import BoardListChooser from 'components/BoardListChooser'

import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'

export default class PrefillSelect extends Component {

  onChange = (e, { value }) => {
    const { options } = this.props

    // const selected = options.available.find(o => o.id === this.refs.select.value)
    // const prefill = {
    //   ...options,
    //   selected,
    //   value
    // }
    //
    // console.log(prefill)

    // this.props.onChange(prefill)
  }

  render () {
    const { options } = this.props

    const dropdownOptions = options.available.map(
      (type, index) => ({
        key: index,
        text: type.label,
        value: type.id
      })
    )

    return (
      <Dropdown
        selection
        options={dropdownOptions}
        onChange={this.onChange}
        value={options.selected.id}
      />
    )

    // return (
    //   <div>
    //     <label>Default Value:</label>
    //
    //     <div className='form-group'>
    //       <select
    //         ref='select'
    //         className='form-control'
    //         value={options.selected.id}
    //         onChange={this.onChange}>
    //         {
    //           options.available.map((type, i) => {
    //             return (
    //               <option key={i} value={type.id}>
    //                 {type.label}
    //               </option>
    //             )
    //           })
    //         }
    //       </select>
    //     </div>
    //
    //     {#<{(|this.getSubOption()|)}>#}
    //
    //   </div>
    // )
  }

  // getSubOption () {
  //   const {
  //     options
  //   } = this.props
  //
  //   switch (options.selected.id) {
  //     case PrefillTypes.USER_DEFINED.id:
  //       return (
  //         <input
  //           className='form-control'
  //           defaultValue={options.value}
  //           placeholder='Type something...'
  //           onChange={e => this.onChange(e.target.value)}
  //         />
  //       )
  //     case PrefillTypes.BOARD_LIST_CHOOSE.id:
  //       return <p>board list chooser</p>
  //       return (
  //         <BoardListChooser prefillValue={options.value} onChange={this.onChange} />
  //       )
  //     case PrefillTypes.CHOOSE_DATE.id:
  //       return (
  //         <Flatpickr
  //           className='form-control'
  //           onChange={this.onChange}
  //           options={{
  //             enableTime: true,
  //             altInput: true,
  //             defaultDate: 'today'
  //           }}
  //         />
  //       )
  //     default:
  //       return null
  //   }
  // }
}
