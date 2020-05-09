import React, { Component } from "react";
import DayTimePicker from '../DateTimePicker/DayTimePicker'
import AlgoliaPlaces from 'algolia-places-react';
import AppContext from '../Context/AppContext'
import config from '../../config'
import '../../AlgoliaPlaces.css'

export default class AddEvents extends Component {
static contextType = AppContext

  state = {
    parent_name : '',
    title : '',
    description : '',
    address:'',
    type:'',
    time_of_event: new Date()
  }

  onChange = (date) => {
    this.setState({
      time_of_event: date,
    });
  }

  handleSelect = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  handleAddress = (suggestion) => {
    const {name, city, administrative, postcode} = suggestion
    this.setState({
      address: `${name}, ${city}, ${administrative} ${postcode}`
    })
  }

  handleChange =(e) => {
    this.setState({
      [e.target.name] : e.target.value,
    });
  }

  handleSubmit =(e)=> {
    e.preventDefault()
      fetch(`${config.API_ENDPOINT}/events`,{
      method:'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        parent_name: this.state.parent_name,
        title: this.state.title,
        description: this.state.description,
        address:this.state.address,
        type:this.state.type,
         time_of_event: this.state.time_of_event
      }),
    })
    .then((res)=> {
      if(!res.ok) return res.json().then((e)=> Promise.reject(e));
      return res.json();
    })
    .then((event)=> {
      this.context.addEvent(event)
      this.props.history.push(`/events/${event.id}`);
    })
    .catch((error) => {
      console.log({error});
    });
  }

  render() {
    return (
      <>
        <h2>Create your event</h2>
        <p>Choose date and time:</p>
        <form onSubmit ={this.handleSubmit}>
          <DayTimePicker onChange={this.onChange}
          value={this.state.time_of_event} /> <br/>
          <label>Parent name</label> <br/>
          <input onChange={(e) => this.handleChange(e)}
            type="text" 
            name="parent_name" 
            value={this.state.parent_name} 
            required />
            <br/>
          <label>Event title</label> <br/>
          <input onChange={(e) => this.handleChange(e)}
            type="text" 
            name="title" 
            value={this.state.title} 
            required />
          <br/>
          <label>Describe your event</label><br/>
          <textarea onChange={(e) => this.handleChange(e)}
            type="text" 
            value={this.state.description} 
            name="description" 
            required />
          <br/>
          <label>Address</label><br/>
          <AlgoliaPlaces
            placeholder='Write an address here'
            options={{
              appId: config.APPID,
              apiKey: config.SEARCH_KEY,
              language: 'en',
              countries: ['us'],
              type: 'address',
              // Other options from https://community.algolia.com/places/documentation.html#options
            }}
      
            onChange={({ query, rawAnswer, suggestion, suggestionIndex }) => 
              this.handleAddress(suggestion)}
              />
              <label>Event type</label><br/>
          <select name="type"
                onChange={(e) => this.handleChange(e)}>
                <option>--</option>
                <option name='type' value={this.state.type}>Arts & Crafts</option>
                <option name='type' value={this.state.type}>Music & Dance</option>
                <option name='type' value={this.state.type}>Outdoor activities</option>
                <option name='type' value={this.state.type}>Sport & Fitness</option>
                <option name='type' value={this.state.type}>Books & Films</option>
                <option name='type' value={this.state.type}>Tutoring</option>
              </select> <br/>
          <input type="submit" value="add event" />
        </form>
      </>
    );
  }
}
