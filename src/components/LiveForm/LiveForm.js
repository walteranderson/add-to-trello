import React, { Component } from 'react'
import getFieldComponent from './Fields'

export default class LiveForm extends Component {
  onChange (field) {
    return value => {
      //
    }
  }

  render () {
    const { fields } = this.props
    return (
      <form>
        {fields.map((field, index) => {
          const Component = getFieldComponent(field)
          if (!Component) return

          return (
            <Component
              key={index}
              field={field}
              onChange={this.onChange(field)}
            />
          )
        })}
      </form>
    )
  }
}
