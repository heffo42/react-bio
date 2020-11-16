import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [
        "Go to the store", "Wash the dishes", "Learn some code"
      ],
      selected: null
    }

    this.addItem = this.addItem.bind(this)
    this.expandDetails = this.expandDetails.bind(this)
    // this.handleChange = this.handleChange.bind(this)
  }

  expandDetails(e) {
    e.preventDefault()

    console.log('expandDetails was clicked')
    console.log(e.target.id)
    this.setState({selected: e.target.id})
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
    const a = `http://157.230.216.187:5000/?search=${encodeURIComponent(e.target.value)}`
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

  render() {

    const hasDetails = this.state.selected != null

    let details;
    if (hasDetails) {
      details = (<div>has details</div>)
    } else {
      details = (<div>does not have details</div>)
    }

    return (<div className="content">
      <div className="container">
        <section className="section">
          <form className="form" id="addItemForm">
            <input type="text" className="input" id="addInput" onChange={this.handleChange.bind(this)} placeholder="Something that needs ot be done..."/>
            <button className="button is-info" onClick={this.addItem}>
              Add Item
            </button>
          </form>
        </section>
        <section className="section">
          <ul>
            {
              this.state.list.map(item => (<li key={item}>{item}
                <button id={item} onClick={this.expandDetails}>See more</button>
              </li>))
            }
          </ul>
        </section>
        <hr/> {details}
      </div>
    </div>)
  }
}

export default App;
