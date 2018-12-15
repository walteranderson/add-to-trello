import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Dropdown } from 'semantic-ui-react'

import DraggableCard from './DraggableCard'

// Must be class instance for drag-drop context to work
class EditableForm extends Component {
  addField = (e, { value }) => {
    this.props.addField(value)
  }

  render () {
    const { fields, available, ...otherProps } = this.props

    const availableFields = available.map(field => ({
      text: field.label,
      value: field.id
    }))

    return (
      <form>
        {fields.map((field, index) => {
          return (
            <DraggableCard
              key={field.id}
              index={index}
              field={field}
              {...otherProps}
            />
          )
        })}

        <Dropdown
          fluid
          button
          labeled
          icon='add'
          className='icon'
          text='Add a Field'
          selectOnBlur={false}
          selectOnNavigation={false}
          onChange={this.addField}
          options={availableFields}
        />
      </form>
    )
  }
}

export default DragDropContext(HTML5Backend)(EditableForm)
