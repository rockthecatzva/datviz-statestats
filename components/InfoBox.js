import React, { Component, PropTypes } from 'react'
//var Loader = require('halogen/PulseLoader')
export default class InfoBox extends Component {

  render() {
    const { renderData, dataLabel, dataProp } = this.props

    return (
      <div className="info-box">
        <h3>{dataLabel}</h3>
        {(renderData) &&
          <h4>{renderData[0][dataProp]}</h4>
        }
        {(!renderData) &&
          <div className="loading">Loading&#8230;</div>
        }
      </div>
    )
  }
}

InfoBox.propTypes = {
  /*options: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ).isRequired,*/
  renderData: PropTypes.array.isRequired,
  dataProp: PropTypes.string.isRequired,
  dataLabel: PropTypes.string.isRequired

  //value: PropTypes.string.isRequired,
  //onChange: PropTypes.func.isRequired,
  //propname: PropTypes.string.isRequired
  //uxCallback: PropTypes.func.isRequired,
  //dataTag: PropTypes.string.isRequired
}
