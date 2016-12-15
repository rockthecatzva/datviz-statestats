import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchAPIData, updateSettings, updateComputedData, clearAPIData} from '../actions'
import DataVizContainer from '../containers/DataVizContainer'


class App extends Component {
  constructor(props) {
    super(props)
    this.onUpdateSettings = this.onUpdateSettings.bind(this)
    this.onUpdateComputedData = this.onUpdateComputedData.bind(this)
  }


  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    let newURL = null
    let currUrl = ""

    for(var call in nextProps.apiSettings){
      if(this.props.apiSettings.hasOwnProperty(call)){
        currUrl = this.buildURL(this.props.apiSettings[call])
        newURL = this.buildURL(nextProps.apiSettings[call])

        if(currUrl!=newURL)
        {
          //one of the properties has changed - make a new API call
          dispatch(clearAPIData(call))
          dispatch(fetchAPIData(newURL, call))
        }
      }
      else{
        dispatch(clearAPIData(call))
        newURL = this.buildURL(nextProps.apiSettings[call])
        if(newURL){
            dispatch(fetchAPIData(newURL, call))
        }
      }
    }


  }

  onUpdateSettings(settings, tag){
    let newsettings = Object.assign({}, this.props.apiSettings[tag], settings)
    this.props.dispatch((dispatch)=>{
      dispatch(updateSettings(newsettings, tag))
    })
  }

  onUpdateComputedData(settings){
    let newsettings = Object.assign({}, this.props.computedData, settings)

    this.props.dispatch((dispatch)=>{
      dispatch(updateComputedData(newsettings))
    })
  }

  //the new URL needs to be created after the settings have been updated
  buildURL(settings){
    //const baseurl = "http://localhost:8888/api-tvratings-phpslim/"
    let baseurl = "";
    var url = baseurl + settings["url"]

    for (var set in settings){
      if(settings[set] == null) return null

      if(Array.isArray(settings[set])){
        for(var subset in settings[set]){
          url += "&"+set+"%5B%5D="+settings[set][subset]
        }
      }
      else{
        //not an array so just concat it!
        if(set!="tag"&&set!="url"){
          url += "&"+set+"="+settings[set]
        }
      }
    }
    return url
  }

  render() {
    const {apiData, apiSettings, computedData } = this.props

    return (
      <div>
      <DataVizContainer apiData={apiData} updateSettingsHandler={this.onUpdateSettings} computedData={computedData} updateComputedDataHandler={this.onUpdateComputedData} />
      </div>
    )
  }
}

App.propTypes = {
  apiData: PropTypes.object.isRequired,
  apiSettings: PropTypes.object.isRequired,
  computedData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { apiData, apiSettings, computedData } = state

  return {
    apiData,
    apiSettings,
    computedData
  }
}

export default connect(mapStateToProps)(App)
