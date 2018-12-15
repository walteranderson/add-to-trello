import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import { flow } from 'lodash'
import PrefillSelect from './PrefillSelect'
import { Label, Segment, Icon } from 'semantic-ui-react'

const CARD = 'card'

const cardSource = {
  beginDrag (props) {
    return {
      id: props.field.id,
      index: props.index
    }
  }
}

const cardTarget = {
  hover (props, monitor) {
    const { index: dragIndex } = monitor.getItem()
    const { index: hoverIndex } = props

    if (dragIndex !== hoverIndex) {
      props.moveField(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex
    }
  }
}

const styles = {
  container: {
    marginBottom: '8px',
    cursor: 'move',
  },
  removeIcon: {
    position: 'absolute',
    top: '7px',
    right: '2px',
    cursor: 'pointer'
  }
}

const DraggableCard = (props) => {
  const {
    field,
    isDragging,
    removeField,
    updatePrefill,
    connectDragSource,
    connectDropTarget
  } = props
  const opacity = isDragging ? 0 : 1

  return connectDragSource(connectDropTarget(
    <div>
      <Segment style={{...styles.container, opacity}}>
        <Label attached='top' size='large'>{field.label}</Label>

        <PrefillSelect
          options={field.prefill}
          onChange={(prefill) => updatePrefill(field.id, prefill)}
        />

        <Icon
          name='remove'
          color='red'
          size='large'
          style={styles.removeIcon}
          onClick={() => removeField(field.id)}
        />

      </Segment>
    </div>
  ))
}

export default flow(
  DropTarget(CARD, cardTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource(CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(DraggableCard)
