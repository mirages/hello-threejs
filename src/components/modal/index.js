import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import './index.css'

const modalRoot = document.querySelector('#root-modal')

export default class Modal extends React.Component {
  modalRef = React.createRef()
  state = {
    test: 'a'
  }

  handleClick = (e) => {
    if (e.target === this.modalRef.current) {
      this.props.onClose()
    }
  }

  componentDidMount () {
    console.log('lifecycle - componentDidMount')
  }

  static getDerivedStateFromProps (props, state) {
    console.log('lifecycle - getDerivedStateFromProps', props, state)

    return state
  }

  shouldComponentUpdate () {
    console.log('lifecycle - shouldComponentUpdate')
    return true
  }

  getSnapshotBeforeUpdate (prevProps, prevState) {
    console.log('lifecycle - getSnapshotBeforeUpdate', prevProps, prevState)

    return 'aaa'
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    console.log('lifecycle - componentDidUpdate', prevProps, prevState, snapshot)
  }

  componentWillUnmount () {
    console.log('lifecycle - componentWillUnmount')
  }

  render () {
    const { show, children } = this.props
    console.log('modal render')

    return ReactDOM.createPortal((
      <div
        ref={this.modalRef}
        className={classNames({ 'modal': true, 'modal--in': show })}
        onClick={this.handleClick}>
        {children}
      </div>
    ), modalRoot)
  }
}