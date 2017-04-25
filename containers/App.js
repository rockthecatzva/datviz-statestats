import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchAPIData, updateSettings, updateComputedData, clearAPIData} from '../actions';
import SimpleList from '../components/SimpleList';
//import InfoBox from '../components/InfoBox';
//import TitleBox from '../components/TitleBox';
import Histogram from '../components/Histogram';
import RadioButtons from '../components/RadioButtons';
import MapUSA from '../components/MapUSA';

class App extends Component {
  constructor(props) {
    super(props);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);
    this.onUpdateComputedData = this.onUpdateComputedData.bind(this);
    this.onUxEvent = this.onUxEvent.bind(this);
  }

  componentWillMount(){
    this.onUpdateComputedData({"selectedState": "No state selected", "selectedValue": null, "selectedRange": null, "selectedStatLabel": null})
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props
    let newURL = null,
        currUrl = "";

    for(var call in nextProps.apiSettings){
      if(this.props.apiSettings.hasOwnProperty(call)){
        currUrl = this.buildURL(this.props.apiSettings[call]);
        newURL = this.buildURL(nextProps.apiSettings[call]);

        if(currUrl!=newURL)
        {
          //one of the properties has changed - make a new API call
          dispatch(clearAPIData(call))
          dispatch(fetchAPIData(newURL, call, nextProps.apiSettings[call]["processor"]))
        }
        else{

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
    //let newsettings = Object.assign({}, this.props.apiSettings[tag], settings)
    let newsettings = settings//this means no more mixing - state is overwritten
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
    switch (tag) {
      case "StatSelected":
        this.onUpdateComputedData({"selectedRange": null, "selectedValue": null, "selectedStatLabel": uxdat["label"]});
        this.onUpdateSettings(uxdat["apiObj"], "Selected-Stat");//this called last - it initiates the api call!
        break;
      case "map-click":
        //tell the histogram to highlight XXXXXX
        this.onUpdateComputedData({"selectedValue": uxdat["value"], "selectedRange": null});
        break;
      case "histogram-click":
        //tell the map to highlight certain states
        this.onUpdateComputedData({"selectedRange": uxdat["range"], "selectedValue": null});
        break;
    }
  }

  //the new URL needs to be created after the settings have been updated
  buildURL(settings){
    let baseurl = "",
        url = baseurl + settings["url"];

    for (var set in settings){
      if(settings[set] == null) return null;
      if(Array.isArray(settings[set])){
        for(var subset in settings[set]){
          url += "&"+set+"%5B%5D="+settings[set][subset];
        }
      }
      else{
        if(set!="url"&&set!="processor"){
          url += "&"+set+"="+settings[set];
        }
      }
    }
    return url;
  }

  render() {
    const {apiData, apiSettings, computedData } = this.props;

    const radOptions = [{"label": "Edu=High School", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get": "NAME,DP02_0061E,DP02_0058E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0061E"])/parseInt(v["DP02_0058E"]))*100)}}}},
    {"label": "Edu=Bachlors", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP02_0064E,DP02_0058E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP02_0064E"])/parseInt(v["DP02_0058E"]))*100)}}}},
    {"label": "Unmarried Births (per 1k)", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP02_0038E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": parseInt(v["DP02_0038E"])}}}},
    {"label": "%White", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP05_0032E,DP05_0028E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0032E"])/parseInt(v["DP05_0028E"]))*100)}}}},
    {"label": "%Black", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP05_0033E,DP05_0028E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0033E"])/parseInt(v["DP05_0028E"]))*100)}}}},
    {"label": "%Hispanic", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP05_0066E,DP05_0065E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP05_0066E"])/parseInt(v["DP05_0065E"]))*100)}}}},
    {"label": "% No Health Insurace", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP03_0099E,DP03_0095E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.round((parseInt(v["DP03_0099E"])/parseInt(v["DP03_0095E"]))*100)}}}},
    {"label": "Median Age", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP05_0017E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": parseInt(v["DP05_0017E"])}}}},
    {"label": "Median HH Income", "apiObj": {"url": "http://api.census.gov/data/2015/acs1/profile?", "for":"state:*", "get":"NAME,DP03_0062E", "processor": (v,i)=>{return {"id": parseInt(v["state"]), "state": v["NAME"], "value": Math.trunc(parseInt(v["DP03_0062E"])/1000)}}}},
    {"label": "% Highly Religious", "apiObj": {"url": "http://rockthecatzva.com/dataviz-statestats/religosity.json", "processor": (v,i)=>{return {"id": parseInt(v["id"]), "state": v["state"], "value": parseInt(v["val"])}}}},
    {"label": "% Trump", "apiObj": {"url": "http://rockthecatzva.com/dataviz-statestats/trump.json", "processor": (v,i)=>{return {"id": parseInt(v["id"]), "state": v["state"], "value": parseInt(v["val"])}}}},
  ];

  return (
      <div className="container" onclick="console.log('body click')" >
        <h5>1. Click a demographic button below.</h5>
        <RadioButtons uxTag={"StatSelected"} uxCallback={this.onUxEvent} renderData={radOptions} />

        <h1>{computedData["selectedStatLabel"]} by State</h1>

        <div className="row histomap-sect">

        {(apiData["Selected-Stat"]) &&
        <div>
            <div className="col-md-8 col-sm-12">
              <MapUSA renderData={apiData["Selected-Stat"]} uxCallback={this.onUxEvent} highLightRange={computedData["selectedRange"]} />
            </div>
            <div className="col-md-4 col-sm-12">
              <Histogram renderData={apiData["Selected-Stat"].map((v)=>{return v["value"]})} highLightValue={computedData["selectedValue"]} uxCallback={this.onUxEvent} />
            </div>
            <div>
              <SimpleList renderData={apiData["Selected-Stat"]} columnList={["state", "value"]} uxCallback={this.onUxEvent} dataTag={""} />
            </div>
        </div>
        }
      </div>
        <br/>
        <p>Source: American Community Survrey (ACS) 2015. Religousity data is by Pew Research <a href="http://www.pewresearch.org/fact-tank/2016/02/29/how-religious-is-your-state/?state=alabama">link</a></p>
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
  const { apiData, apiSettings, computedData } = state;

  return {
    apiData,
    apiSettings,
    computedData
  }
}

export default connect(mapStateToProps)(App)
