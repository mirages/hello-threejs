import React from 'react'
import classNames from 'classnames'

import './index.css'

export default class Button extends React.Component {
  render () {
    const { disabled, onClick } = this.props
    console.log('button render')

    return (
      <button
        className={
          classNames({
            button: true,
            'button--disabled': disabled
          })
        }
        disabled={disabled}
        onClick={onClick}
      >
        {this.props.children}
      </button>
    )
  }
}