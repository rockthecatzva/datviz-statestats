import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class Dropdown extends Component {

  componentDidMount(){
    console.log("Buttons mounted!!", this.props.uxTag, this.props.renderData[0]);
    this.props.uxCallback(this.props.uxTag, this.props.renderData[0])
  }


  render() {
    const { renderData, uxCallback } = this.props

    return (
      <div className="dropdown">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Select a demo
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <button className="dropdown-item" href="#">Action</button>
          <button className="dropdown-item" href="#">Another action</button>
          <button className="dropdown-item" href="#">Something else here</button>
        </div>


        </div>
      )
    }
  }

  Dropdown.propTypes = {
    renderData: PropTypes.array.isRequired,
    uxCallback: PropTypes.func.isRequired,
    uxTag: PropTypes.string.isRequired
  }
