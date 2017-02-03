import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchAPIData, updateSettings, updateComputedData, clearAPIData} from '../actions'
import SimpleList from '../components/SimpleList'
import InfoBox from '../components/InfoBox'
import TitleBox from '../components/TitleBox'
import Histogram from '../components/Histogram'
import RadioButtons from '../components/RadioButtons'
import MapUSA from '../components/MapUSA'

class App extends Component {
  constructor(props) {
    super(props)
    this.onUpdateSettings = this.onUpdateSettings.bind(this)
    this.onUpdateComputedData = this.onUpdateComputedData.bind(this)
    this.onUxEvent = this.onUxEvent.bind(this)
  }

  componentWillMount(){
    console.log("APP WILL MOUNT!!!");
    this.onUpdateComputedData({"selectedState": "No state selected"})
    this.onUpdateComputedData({"selectedValue": null})
    this.onUpdateComputedData({"selectedRange": null})
    this.onUpdateComputedData({"selectedStatLabel": null})
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
        else{
          console.log("Is this ever equal?? currUrl vs newURL");
        }

      }
      else{
        dispatch(clearAPIData(call))
        newURL = this.buildURL(nextProps.apiSettings[call])
        console.log(newURL, call);
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
    console.log(tag, uxdat);
    switch (tag) {
      case "StatSelected":
        console.log("processing a stat seletion");
        this.onUpdateComputedData({"selectedRange": null})
        this.onUpdateComputedData({"selectedValue": null})
        this.onUpdateComputedData({"selectedStatLabel": uxdat["label"]})
        this.onUpdateSettings(uxdat["apiObj"], "Selected-Stat")
        break;
      case "map-click":
        //tell the histogram to highlight XXXXXX
        this.onUpdateComputedData({"selectedRange": null})
        this.onUpdateComputedData({"selectedValue": uxdat["value"]})
        break;
      case "histogram-click":
        //tell the map to highlight certain states
        this.onUpdateComputedData({"selectedValue": null})
        this.onUpdateComputedData({"selectedRange": uxdat["range"]})
        break;
    }

    //console.log("ux event ", tag, uxdat, computedData["selectedValue"], computedData["selectedRange"]);

  }

  //the new URL needs to be created after the settings have been updated
  buildURL(settings){
    console.log(settings);
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

    const radOptions = [{"label": "Edu=High School", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get": "NAME,DP02_0061E,DP02_0058E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0061E"])/parseInt(v["DP02_0058E"]))*100)}}}},
                        {"label": "Edu=Bachlors", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP02_0064E,DP02_0058E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0064E"])/parseInt(v["DP02_0058E"]))*100)}}}},
                        {"label": "Unmarried Births (per 1k)", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP02_0038E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": parseInt(v["DP02_0038E"])}}}},
                        {"label": "%White", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP05_0032E,DP05_0028E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0032E"])/parseInt(v["DP05_0028E"]))*100)}}}},
                        {"label": "%Black", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP05_0033E,DP05_0028E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0033E"])/parseInt(v["DP05_0028E"]))*100)}}}},
                        {"label": "%Hispanic", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP05_0066E,DP05_0065E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0066E"])/parseInt(v["DP05_0065E"]))*100)}}}},
                        {"label": "% No Health Insurace", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP03_0099E,DP03_0095E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP03_0099E"])/parseInt(v["DP03_0095E"]))*100)}}}},
                        {"label": "Median Age", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP05_0017E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": parseInt(v["DP05_0017E"])}}}},
                        {"label": "Median HH Income", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP03_0062E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.trunc(parseInt(v["DP03_0062E"])/1000)}}}},
                      ]

    return (
      <div>
      <div className="container">
        <h1>Generic DataViz Container</h1>

        <h2>{computedData["selectedStatLabel"]}</h2>

        <div className="row">
          <RadioButtons uxTag={"StatSelected"} uxCallback={this.onUxEvent} renderData={radOptions} />
        </div>


        {(apiData["Selected-Stat"]) &&
          <div>
          <div className="row">
            <h3>Click on a state or a bar in the histogram:</h3>
          </div>
            <div className="row">
              <MapUSA height={300} width={500} renderData={apiData["Selected-Stat"]} uxCallback={this.onUxEvent} highLightRange={computedData["selectedRange"]} />
              <Histogram renderData={apiData["Selected-Stat"].map((v)=>{return v["value"]})} width={300} height={300} title={"Histogram Title Here"} highLightValue={computedData["selectedValue"]} uxCallback={this.onUxEvent} />
            </div>
            <div className="row">
              <SimpleList renderData={apiData["Selected-Stat"]} columnList={["state", "value"]} uxCallback={this.onUxEvent} dataTag={""} />
            </div>
          </div>
        }

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
