import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game'
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';

import CanvasJSReact from './assets/canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// const base_url = 'http://157.230.216.187:5000/'
const base_url = 'http://127.0.0.1:5000/'

class SearchItem extends Component {
  render() {
    return (<li key={this.props.itemName}>{this.props.itemName}
      <button id={this.props.itemName} onClick={this.props.onClick}>See more</button>
    </li>)
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [
        "Go to the store", "Wash the dishes", "Learn some code"
      ],
      selected_data: null,
      selectedOption: 'drug',
      activeCompanyData: null
    }

    this.addItem = this.addItem.bind(this)
    this.expandDetails = this.expandDetails.bind(this)
    // this.handleChange = this.handleChange.bind(this)

    this.onChangeValue = this.onChangeValue.bind(this)

  }

  expandDetails(e) {
    e.preventDefault()

    console.log('expandDetails was clicked')
    console.log(e.target.id)

    if (this.state.selectedOption == 'drug') {
      const url = `${base_url}/details?drug_name=${encodeURIComponent(e.target.id)}`

      fetch(url).then(res => res.json()).then((result) => {
        console.log(result)

        this.setState({selected_data: result})
      })
    } else {

      console.log('fetching company profile')
      const url = `${base_url}company_profile?name=${encodeURIComponent(e.target.id)}`

      fetch(url).then(res => res.json()).then((result) => {
        console.log(result)
        this.setState({selected_data: result})
      })

    }

  }

  addItem(e) {
    e.preventDefault()

    let list = this.state.list
    const newItem = document.getElementById('addInput')
    const form = document.getElementById("addItemForm")

    if (newItem.value != "") {
      list.push(newItem.value)

      this.setState({list: list})

      newItem.classList.remove('is-danger')
      form.reset()

      console.log('the button has been click')

    } else {
      newItem.classList.add('is-danger')
    }

  }

  handleChange(e) {

    let a;
    if (this.state.selectedOption == 'drug') {
      a = `${base_url}?search=${encodeURIComponent(e.target.value)}`

    } else {
      a = `${base_url}company?search=${encodeURIComponent(e.target.value)}`

    }

    console.log(a)
    fetch(a).then(res => res.json()).then((result) => {
      console.log(result)
      this.setState({list: result})
    }, (error) => {
      this.setState({isLoaded: true, error});
    })

  }

  onChangeValue(event) {
    console.log(event.target.value)
    this.setState({selectedOption: event.target.value})
  }

  render() {

    const hasDetails = this.state.selected_data != null

    let details;
    if (hasDetails) {

      if (this.state.selectedOption == 'drug') {

        details = (<ul>
          {
            this.state.selected_data.map(item => (<li>{
                `CompanyName ${item.CompanyName}and status date ${item.StatusDate}
          with status ${item.DevelopmentStatus}`
              }</li>))
          }
        </ul>)

      } else {

        //diplay chart here
        // const options = {
        //   title: {
        //     text: "Theraputic Areas"
        //   },
        //   data: [
        //     {
        //       type: "column",
        //       dataPoints: this.state.selected_data.chart
        //     }
        //   ]
        // }
        //
        // console.log(options.data.dataPoints)
        //
        // details = (<div style={{
        //     width: "50%"
        //   }}><CanvasJSChart options={options}/></div>)

        details = (<Table striped="striped" bordered="bordered" hover="hover">
          <thead>
            <tr>
              <th>Drug Name</th>
              <th>Indication</th>
              <th>Current Phase</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.selected_data.pipeline.map(item => (<tr>
                <td>{item['_id']['DrugName']}</td>
                <td>{item['_id']['Indication']}</td>

                <td>{item['lastPhase']}</td>
                <td>{item['lastUpdate'].substring(4, 6) + '-' + item['lastUpdate'].substring(6, 8) + '-' + item['lastUpdate'].substring(0, 4)}</td>
              </tr>))
            }
          </tbody>
        </Table>)

      }
    } else {
      details = (<div>does not have details</div >)
    }

    return (<div className="content">

      <div className="container">

        <div className="flex-container">

          <div className="flex-child">
            <form className="form" id="addItemForm">
              <input style={{
                  width: "100%"
                }} type="text" className="input" id="addInput" onChange={this.handleChange.bind(this)} placeholder={`Search for a ${this.state.selectedOption}`}/>
            </form>
          </div>

          <div className="flex-child" onChange={this.onChangeValue}>
            <input type="radio" value="drug" name="search_type" defaultChecked="true"/>
            Drug
            <input type="radio" value="company" name="search_type"/>
            Company
          </div>

        </div>

        <div className="searchItems">
          <ul>
            {this.state.list.map(item => (<SearchItem itemName={item} key={item} onClick={this.expandDetails}/>))}
          </ul>
        </div>

        <hr/> {details}
      </div>
    </div>)
  }
}

export default App;
