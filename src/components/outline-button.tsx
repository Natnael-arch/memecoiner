import React from 'react'
import './outline-button.css'

interface OutlineButtonProps {
  button1: string;
}

const OutlineButton = ({ button1 }: OutlineButtonProps) => {
  return (
    <div className="outline-button-container">
      <button className="outline-button-button button Button">
        {button1}
      </button>
    </div>
  )
}

OutlineButton.defaultProps = {
  button1: 'Button',
}

export default OutlineButton
