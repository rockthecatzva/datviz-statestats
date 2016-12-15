import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import TelecastListSimplest from '../components/SimpleList'
import InfoBox from '../components/InfoBox'
import TitleBox from '../components/TitleBox'
import Histogram from '../components/Histogram'
import RadioButtons from '../components/RadioButtons'

//const CONTAINER_TAG = "PrimaryViz"

export default class DataVizContainer extends Component {
  constructor(props) {
    super(props)
    this.onUxEvent = this.onUxEvent.bind(this)
  }

  componentWillReceiveProps(nextProps){
    for(var dat in nextProps.apiData){
      if(this.props.apiData.hasOwnProperty(dat)){
        if(this.props.apiData[dat]!=nextProps.apiData[dat]){
          //new apiData is in, time to update the computed data
          console.log("-----> ", dat);

        }
      }
    }
  }

  onUxEvent(tag, uxdat){
    switch (tag) {
      case "Median-Ages":
      //What if median ages has more than 1 control "switch"?
        //Median-Ages events will effect SelectedState-Income
        this.props.updateSettingsHandler({"for": "state:"+uxdat["state"]}, "SelectedState-Income")
        this.props.updateComputedDataHandler({"selectedState": uxdat["NAME"]})
        break;
    }
  }

  componentDidMount(){
    if(this.props.updateSettingsHandler){
        //initialize the api Settings for each piece of data
        this.props.updateComputedDataHandler({"selectedState": "No state selected"})
        this.props.updateSettingsHandler({"url": "http://api.census.gov/data/2015/acs1/profile?", "get": "NAME,DP05_0017E", "for":"state:*"}, "Median-Ages")
        this.props.updateSettingsHandler({"url": "http://api.census.gov/data/2015/acs1/profile?", "get": "NAME,DP03_0062E", "for":null}, "SelectedState-Income")
        this.props.updateSettingsHandler({"url": "http://api.census.gov/data/2015/acs1/profile?", "get": "NAME,DP02_0058E", "for":"state:*"}, "Base-Education")
    }
  }

  render (){
    if(this.props.apiData){
      console.log("chec this ", this.props.apiData["Median-Ages"]);
    }

    return (
      <div>
        <h1>Generic DataViz Container</h1>

        {(this.props.computedData) &&
          <TitleBox label={this.props.computedData["selectedState"]} />
        }

        <RadioButtons uxCallback={this.onUxEvent} renderData={[["Pop. Age (median)", "DP02_0038E"],["Income (median)","DP03_0062E"],["Un-married birth (per 1k)", "DP02_0038E"],["Total Poplulation", "DP05_0001E"]]} />

        {(this.props.apiData["Median-Ages"]!=null) &&
          <Histogram renderData={this.props.apiData["Median-Ages"].map((d)=>{return parseInt(d["DP05_0017E"])})} width={300} height={300} title={"Median Ages"} />
        }


        <InfoBox renderData={this.props.apiData["SelectedState-Income"]} dataProp={"DP03_0062E"} dataLabel={"Median Income"} />
        <TelecastListSimplest dataTag={"Median-Ages"} uxCallback={this.onUxEvent} renderData={this.props.apiData["Median-Ages"]} columnList={["DP05_0017E"]} />
      </div>
    )
  }
}


DataVizContainer.propTypes = {
  apiData: PropTypes.object.isRequired,
  updateSettingsHandler: PropTypes.func.isRequired,
  computedData: PropTypes.object.isRequired,
  updateComputedDataHandler: PropTypes.func.isRequired
}
