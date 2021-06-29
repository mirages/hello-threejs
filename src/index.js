import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import Modal from './components/modal'
import Button from './components/button'
import Input from './components/input'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: 'input',
      selected: 'a',
      modal: false
    }
  }

  handleInputChange = e => {
    console.log('input 事件', e)
    this.setState({
      input: e.target.value
    })
  }

  handleSelectChange = e => {
    console.log('select 事件', e)
    this.setState({
      selected: e.target.value
    })
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  render () {
    console.log('app render')
    const { input, selected, modal } = this.state
    return (
      <div>
        <p>input onchange 事件: {input}</p>
        <Input value={input} onChange={this.handleInputChange} />
        <Input disabled value='禁用该输入框' onChange={this.handleInputChange} />
        <p>select 标签使用 value 属性选中某个 option: {selected}</p>
        <select value={selected} onChange={this.handleSelectChange}>
          <option name='a'>a</option>
          <option name='b'>b</option>
          <option name='c'>c</option>
          <option name='d'>d</option>
        </select>

        <p tabIndex={1} onFocus={e => console.log('focus', e)}>按钮：</p>
        <Button disabled>禁用状态</Button>
        <Button onClick={this.toggleModal}>显示弹窗</Button>

        <Modal show={modal} onClose={this.toggleModal}>
          <div className='modal-app'>
            <p className='modal-app__title'>标题</p>
            <div className='modal-app__content'>
              <p>这是弹窗内容</p>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
