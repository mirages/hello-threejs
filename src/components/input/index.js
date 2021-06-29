import React from 'react'
import classNames from 'classnames'

import './index.css'

export default class Input extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focus: false
    }

    console.log('constructor', this.state)
  }

  toggleFocus = () => {
    this.setState({
      focus: !this.state.focus
    })
  }

  render () {
    const { value, disabled, onChange } = this.props

    return <input
      className={classNames({
        input: true,
        'input--focus': this.state.focus,
        'input--disabled': disabled
      })}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onFocus={this.toggleFocus}
      onBlur={this.toggleFocus}
    />
  }
}