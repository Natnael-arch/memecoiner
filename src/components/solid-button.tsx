import React from 'react'
import './solid-button.css'

interface SolidButtonProps {
  button: string;
}

const SolidButton = ({ button }: SolidButtonProps) => {
  return (
    <div className="solid-button-container">
      <button className="solid-button-button button Button">
        {button}
      </button>
    </div>
  )
}

SolidButton.defaultProps = {
  button: 'Button',
}

export default SolidButton 