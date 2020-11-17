import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game'

// const base_url = 'http://157.230.216.187:5000/'
const base_url = 'http://127.0.0.1:5000/'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [
        "Go to the store", "Wash the dishes", "Learn some code"
      ],
      selected_data: null
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

    const url = `${base_url}/details?drug_name=${encodeURIComponent(e.target.id)}`

    fetch(url).then(res => res.json()).then((result) => {
      console.log(result)

      this.setState({selected_data: result})
    })

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
    // console.log(e.target.value)
    const a = `${base_url}?search=${encodeURIComponent(e.target.value)}`
    console.log(a)
    fetch(a).then(res => res.json()).then((result) => {
      console.log(result)
      this.setState({list: result})
    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
      this.setState({isLoaded: true, error});
    })
  }

  // function drugDetails(props){
  //
  // }

  onChangeValue(event) {
    console.log(event.target.value)
  }

  render() {

    const hasDetails = this.state.selected_data != null

    let details;
    if (hasDetails) {
      details = (<ul>
        {
          this.state.selected_data.map(item => (<li>{
              `CompanyName ${item.CompanyName}and status date ${item.StatusDate}
          with status ${item.DevelopmentStatus}`
            }</li>))
        }
      </ul>)
    } else {
      details = (<div>does not have details</div >)
    }

    return (<div className="content">
      <div className="container">

        <div className="flex-container">

          <div className="flex-child">
            <form className="form" id="addItemForm">
              <input type="text" className="input" id="addInput" onChange={this.handleChange.bind(this)} placeholder="Something that needs ot be done..."/>
            </form>
          </div>

          <div className="flex-child" onChange={this.onChangeValue}>
            <input type="radio" value="drug" name="search_type"/>
            Drug
            <input type="radio" value="company" name="search_type"/>
            Company
          </div>

        </div>

        <div className="section">
          <ul>
            {
              this.state.list.map(item => (<li key={item}>{item}
                <button id={item} onClick={this.expandDetails}>See more</button>
              </li>))
            }
          </ul>
        </div>

        <hr/> {details}
      </div>
    </div>)
  }
}

export default App;
