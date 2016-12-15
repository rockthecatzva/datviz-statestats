import React, { Component, PropTypes } from 'react'

export default class Picker extends Component {

  componentDidMount(){
    //console.log("its here")
  }



  componentWillReceiveProps(nextProps){
    console.log("compare ", this.props, nextProps)


  }

  render() {
    const { value, onChange, options, propname } = this.props


    return (
      <span>
        <h1>{value}</h1>
        <select onChange={e => onChange(e.target.value)}
                value={value}>
          {options.map(option =>
            <option value={option[propname]} key={option[propname]}>
              {option[propname]}
            </option>)
          }
        </select>
      </span>
    )
  }
}

Picker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  propname: PropTypes.string.isRequired
}
