import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
//import TelecastListSimplest from '../components/TelecastListSimplest'


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





  render (){
    if(this.props.apiData){
      //console.log("chec this ", this.props.apiData["Median-Ages"]);
    }

    return (

    )
  }
}


DataVizContainer.propTypes = {
  apiData: PropTypes.object.isRequired,
  updateSettingsHandler: PropTypes.func.isRequired,
  computedData: PropTypes.object.isRequired,
  updateComputedDataHandler: PropTypes.func.isRequired
}
