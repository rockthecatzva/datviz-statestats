import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchAPIData, updateSettings, updateComputedData, clearAPIData} from '../actions'
//import DataVizContainer from '../containers/DataVizContainer'
import SimpleList from '../components/SimpleList'
import InfoBox from '../components/InfoBox'
import TitleBox from '../components/TitleBox'
import Histogram from '../components/Histogram'
import RadioButtons from '../components/RadioButtons'

class App extends Component {
  constructor(props) {
    super(props)
    this.onUpdateSettings = this.onUpdateSettings.bind(this)
    this.onUpdateComputedData = this.onUpdateComputedData.bind(this)
    this.onUxEvent = this.onUxEvent.bind(this)
  }

  componentDidMount(){
    console.log("MOUNTED!!!");
    this.onUpdateComputedData({"selectedState": "No state selected"})
    this.onUpdateSettings({"url": "http://api.census.gov/data/2015/acs1/profile?", "get": "NAME,DP05_0017E", "for":"state:*", "processor": function(v,i){ return parseInt(v["DP05_0017E"])}}, "Median-Ages")
    this.onUpdateSettings({"url": "http://api.census.gov/data/2015/acs1/profile?", "get": "NAME,DP03_0062E", "for":null, "processor": function(v,i){return "trest"}}, "SelectedState-Income")
    this.onUpdateSettings({"url": "http://api.census.gov/data/2015/acs1/profile?", "get": "NAME,DP02_0058E", "for":"state:*", "processor": function(v,i){return "trest"}}, "Base-Education")
    this.onUpdateSettings({"url": "http://api.census.gov/data/2015/acs1/profile?", "get": null, "for":"state:*", "processor": function(v,i){return "trest"}}, "Selected-Stat")

  }


  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    let newURL = null
    let currUrl = ""

    for(var call in nextProps.apiSettings){
      if(this.props.apiSettings.hasOwnProperty(call)){
        currUrl = this.buildURL(this.props.apiSettings[call])
        newURL = this.buildURL(nextProps.apiSettings[call])

        //console.log(nextProps.apiSettings[call]["processor"]);
        if(currUrl!=newURL)
        {
          //one of the properties has changed - make a new API call
          dispatch(clearAPIData(call))
          dispatch(fetchAPIData(newURL, call, nextProps.apiSettings[call]["processor"]))
        }
      }
      else{
        dispatch(clearAPIData(call))
        newURL = this.buildURL(nextProps.apiSettings[call])
        if(newURL){
            dispatch(fetchAPIData(newURL, call, nextProps.apiSettings[call]["processor"]))
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

  onUxEvent(tag, uxdat){
    //PROCESS A UX EVENT - from a child component
    console.log("ux event ", tag, uxdat);
    switch (tag) {
      case "Median-Ages":
        onUpdateSettings({"for": "state:"+uxdat["id"]}, "SelectedState-Income")
        this.onUpdateComputedData({"selectedState": uxdat["state"]})
        break;
      case "StatSelected":
        this.onUpdateSettings(uxdat, "Selected-Stat")
        break;
    }
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
        if(set!="url"&&set!="processor"){
          url += "&"+set+"="+settings[set]
        }
      }
    }
    //console.log(url);
    return url
  }

  render() {
    const {apiData, apiSettings, computedData } = this.props

    return (
      <div>
      <div>
        <h1>Generic DataViz Container</h1>

        {(computedData) &&
          <TitleBox label={apiData["selectedState"]} />
        }

        <RadioButtons uxTag={"StatSelected"} uxCallback={this.onUxEvent} renderData={[{"label": "Edu=High School", "apiObj": {"get": "NAME,DP02_0061E,DP02_0058E", "processor": (v,i)=>{return [v["NAME"], Math.round((parseInt(v["DP02_0061E"])/parseInt(v["DP02_0058E"]))*100)]}}}, {"label": "Edu=Bachlors", "apiObj": {"get":"DP02_0064E"}}]} />


          <Histogram renderData={apiData["Median-Ages"]} width={300} height={300} title={"Median Ages"} />



      </div>
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
