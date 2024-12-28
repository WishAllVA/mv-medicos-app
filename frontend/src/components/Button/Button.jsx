import { useState } from 'react'
import './Button.css'

const getButtonStyles = (buttonType = 'secondary') => {
  const commonButtonStyles = {
    borderRadius: '10px'
  }
  switch(buttonType) {
    case 'primary':
      return {
        ...commonButtonStyles,
        color: '#eee',
        backgroundColor: '#64f'
      }
    case 'secondary':
    default:
      return {
        ...commonButtonStyles,
        color: '#64f',
        backgroundColor: '#eee'
      }

  }
}

function Button(props) {
  const { title = 'Submit', type = 'secondary' } = props
  return (
    <button style={getButtonStyles(type)}>
      {title}
    </button>
  )
}

export default Button
