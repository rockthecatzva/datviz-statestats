import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
//import TelecastListSimplest from '../components/TelecastListSimplest'
import SimpleList from '../components/SimpleList'
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
          //NEW APIDATA has ARRIVED -> UPDATE THE COMPUTEDDATA
          //new apiData is in, time to update the computed data
          let tagdata = null
          console.log(nextProps.apiData[dat]["get"]);
          switch (dat) {
            case "Median-Ages":
              tagdata = nextProps.apiData[dat].map((d)=>{return {"age": parseInt(d["DP05_0017E"]), "state": d["NAME"], "id": d["state"]}})
              this.props.updateComputedDataHandler({[dat]: tagdata})
              break
            case "Base-Education":
              tagdata = nextProps.apiData[dat].map((d)=>{return {"value": parseInt(d["DP02_0058E"]), "id": d["state"]}})
              this.props.updateComputedDataHandler({[dat]: tagdata})
              break
            case "Selected-Stat":
              tagdata = nextProps.apiData[dat].map((d)=>{return {"value": (Math.round((parseInt(d["DP02_0061E"])/(this.props.computedData["Base-Education"].find((t)=>{return (t.id==d["state"])}).value))*100)), "id": d["state"]}})
              //console.log(" kkkkk ", tagdata);
              this.props.updateComputedDataHandler({[dat]: tagdata})
              break
          }

        }
      }
    }
  }

  onUxEvent(tag, uxdat){
    //PROCESS A UX EVENT - from a child component
    console.log("ux event ", tag, uxdat);
    switch (tag) {
      case "Median-Ages":
        this.props.updateSettingsHandler({"for": "state:"+uxdat["id"]}, "SelectedState-Income")
        this.props.updateComputedDataHandler({"selectedState": uxdat["state"]})
        break;
      case "StatSelected":
        this.props.updateSettingsHandler(uxdat, "Selected-Stat")
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
        this.props.updateSettingsHandler({"url": "http://api.census.gov/data/2015/acs1/profile?", "get": null, "for":"state:*"}, "Selected-Stat")
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

        <RadioButtons uxTag={"StatSelected"} uxCallback={this.onUxEvent} renderData={[{"label": "Edu=High School", "apiObj": {"get": "DP02_0061E"}}, {"label": "Edu=Bachlors"}, "apiObj": "DP02_0064E"]} />

        {(this.props.apiData["Median-Ages"]!=null) &&
          <Histogram renderData={this.props.apiData["Median-Ages"].map((d)=>{return parseInt(d["DP05_0017E"])})} width={300} height={300} title={"Median Ages"} />
        }


        <InfoBox renderData={this.props.apiData["SelectedState-Income"]} dataProp={"DP03_0062E"} dataLabel={"Median Income"} />
        <SimpleList dataTag={"Median-Ages"} uxCallback={this.onUxEvent} renderData={this.props.computedData["Median-Ages"]} columnList={["state", "age"]} />
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
