import React, { Component, PropTypes } from 'react'

export default class TitleBox extends Component {

  render() {
    const { label } = this.props

    return (<h2>{label}</h2>)
  }
}

TitleBox.propTypes = {
  label: PropTypes.string.isRequired
}
