import React from "react";
import { connect } from "react-redux";
import BigCalendar from 'react-big-calendar';
//import DatePicker from 'react-datepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Datetime from 'react-datetime';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../actions/eventActions"
import { Table, Button, Divider, Modal, Label, Input, Segment, Form, TextArea, Dropdown, Grid, Icon, Confirm, Checkbox, Message } from "semantic-ui-react"
import '../../css/react-big-calendar.css';
import '../../css/datetime.css';
import '../../css/custom.css'
import moment from 'moment';
import _ from 'lodash'; 

BigCalendar.momentLocalizer(moment)

@connect((store) => {
    return {
        events: store.event.events,
        updated: store.event.updated,
        created: store.event.created,
        deleted: store.event.deleted
    };
})


export default class Tactical extends React.Component { 
    
    constructor() {
    super()
    this.state = { showModal: false,
                  currentEvent: null,
                  showSegment: false,
                  currentHover: null,
                  currentTacticalView: 'week',
                  renderPicker: false,
                  setDateError: false,
                  onDate: moment(),
                  testProp: {}, 
                  rendering: {
                      loyalty: 1,
                      crm: 1
                  } }
    }
    
    componentWillMount(){
        
        this.props.dispatch(fetchEvents('tactical'))
        
        this.closeModal = this.closeModal.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.renderEvent = this.renderEvent.bind(this)
        this.renderNewEvent = this.renderNewEvent.bind(this)
        this.renderDatePicker = this.renderDatePicker.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.checkDateChange = this.checkDateChange.bind(this)
        this.handleViewChange = this.handleViewChange.bind(this)
        this.submitEvent = this.submitEvent.bind(this)
        this.flipVisible = this.flipVisible.bind(this)
    }
    
    componentDidUpdate(){
        let cprops = this.props
        if (cprops.deleted || cprops.updated || cprops.created){
            console.log('hello')
            this.props.dispatch(fetchEvents('tactical'))
        }
    }
    
    componentWillReceiveProps(newProps){

        if (newProps.events && newProps.events.message != "Deleted user"){
            let allEvents = newProps.events.data 
            let allEventsFmt = allEvents.map((event) => {
                if (event.body.type && event.body.start && event.body.end) {
                    event.body.start = moment(event.body.start).toDate()
                    event.body.end = moment(event.body.end).toDate()
                }
                return event
            })
            
            allEventsFmt.forEach( (item, index, object) => { if ( !item.body.type || item.body.type.toLowerCase() != 'tactical' ) { object.splice(index, 1); }})
            
            
            this.setState({testProp: { events: allEventsFmt, defaultView: 'week' }})
        }
    }
    
    tacticalStyleGetter = (event, start, end, isSelected) => {
        let style = event.allDay ? event.subType.toLowerCase() : event.subType.toLowerCase()+'-normal'
        return({className: style})
    }
    
    
    renderDetailSegment = item => {
        return (
             <Segment padded>
                Padded content.
            </Segment>
        )
    }
    
    myTacticalCalendar = props => {
    
    return (
          <div>
            <BigCalendar height="700px"
              events={props.actualRendered}
              defaultView={props.defaultView}
              date={props.onDate}
              step={8}
              timeslots={12}
              drilldownView={null}
              startAccessor='start'
              endAccessor='end'
              toolbar={false}
              popup={false}
              onSelectEvent={(event, e) => { this.setState({showModal:true, currentEvent: event, proposedStart: event.start, proposedEnd: event.end, newEvent: false}); }}  
              eventPropGetter={this.tacticalStyleGetter}
            />
          </div>
    )}
    
    flipVisible = (type) => { let cstate = this.state; cstate.rendering[type] = !cstate.rendering[type]; this.setState(cstate) }
    
    handleDateChange = (newDate, key) => { 
        
        if (key == 'start'){
            this.setState({proposedStart: newDate})
        }else {
            this.setState({proposedEnd: newDate})
        }
        
    }
    
    submitEvent = () => {
        let { currentEvent, newEvent } = this.state
        if (newEvent){
            this.props.dispatch(createEvent(currentEvent))
        } else {
            this.props.dispatch(updateEvent(currentEvent))
        }
    }
    
    deleteEvent = () => { let { currentEvent } = this.state; this.props.dispatch(deleteEvent(currentEvent)); }
    
    checkDateChange = () => {
        let cevent = this.state.currentEvent
        let cstart = this.state.proposedStart
        let cend = this.state.proposedEnd
        
         if (moment(cstart).valueOf() > moment(cend).valueOf()){
                this.setState({setDateError: true, proposedStart: cevent.start, proposedEnd: cevent.end})
                return 
            } else { 
                cevent.start = moment(cstart).local().toDate()
                cevent.end = moment(cend).local().toDate()
                this.setState({currentEvent: cevent, renderPicker: false})
            } 
    }
    
    closeModal = () => {
        this.setState({showModal: false, currentEvent: null})
    }
    
    handleUpdate = (data, cb, dropDowndata, e) => { // cb = checkbox? If it's a checkbox flip it, if it's a text field get e value and update
        
    
    let cdata = this.state.currentEvent
    
    if (cb){
        cdata[data] = cdata[data] == 1 ? 0 : 1 
        this.setState({currentEvent: cdata})
    }else{
        if(e){var value = e.target.value;}
        if(dropDowndata != null){ value = dropDowndata.value }
        cdata[data] = value
        this.setState({currentEvent: cdata})
      }
    }
    
    renderDatePicker = () => {
       
        let start = moment(this.state.proposedStart)
        let end = moment(this.state.proposedEnd)
        let dateErrorWarn = <Confirm
          open={this.state.setDateError}
          onCancel={()=> this.setState({setDateError: false})}
          onConfirm={()=> this.setState({setDateError: false})}
          content='Start date must be before end date!'
        />
        
        return (
            <Modal size='small' closeOnDimmerClick={false} onClose={() => this.setState({renderPicker: false})} open={this.state.renderPicker}>
               <Modal.Header> Change Date </Modal.Header>
                <Modal.Content>
                  <Segment>
                  <br></br>
                  {dateErrorWarn}
                 <label className='tinyLabel'> Start Date </label>
                   <div> <Datetime value={start} onChange={(date) => this.handleDateChange(date, 'start')}/> </div>
                   <br></br>
                   <label className='tinyLabel'> End Date </label>
                    <div> <Datetime value={end} onChange={(date) => this.handleDateChange(date, 'end')}/> </div>
                    <br></br>
                    </Segment>
                </Modal.Content>
            <Modal.Actions>
               <Button color='grey' icon='calendar' labelPosition='right' content='OK' onClick={() => { this.checkDateChange() }} />
                </Modal.Actions>
            </Modal>
        )
    }
    
    renderNewEvent = () => {
        let event = {
            type: 'tactical',
            subType: 'CRM',
            title : 'Title here',
            allDay: true,
            channel: '',
            volume: 1000,
            audience: '',
            offer: 'This is a sample promotion where customers are given $1,000,000 bonus bet',
            jobId: '',
            start: moment().seconds(0).toDate(),
            end: moment().seconds(0).toDate()
        }
        this.setState({showModal:true, currentEvent: event, newEvent: true})
    }
    
    handleViewChange = (date) => {   
        this.setState({onDate: moment(date) })
    }
    
    renderEvent = () => {
        
        let newEvent = this.state.newEvent 
        let event = this.state.currentEvent
        let startDate = event.start.toString().replace('GM', ' ').replace('T+1000', '').replace('AEST','').replace('T+1100', '').replace('AEDT','').replace('()','')
        let endDate = event.end.toString().replace('GM', ' ').replace('T+1000', '').replace('AEST','').replace('T+1100', '').replace('AEDT','').replace('()','')
        let { subType, activityName, channel, volume, audience, offer, jobId, week } = event 
        let types = [{ key: 'CRM', value: 'CRM', text: 'CRM' },
                     { key: 'LOYALTY', value: 'LOYALTY', text: 'LOYALTY' }]
        let datePicker = this.state.renderPicker == true ? this.renderDatePicker() : null 
        let deleteButton = !this.state.newEvent ? <Button normal icon='recycle' labelPosition='right' content='Delete' onClick={() => { this.deleteEvent(); ; this.closeModal() } }/> : ''
        let tickButton = this.state.newEvent ? <Button positive icon='plus' labelPosition='right' content='Add' onClick={() => { this.submitEvent(); ; this.closeModal() } }/> : <Button positive icon='checkmark' labelPosition='right' content='Update' onClick={() => { this.submitEvent(); this.closeModal() } }/>
        
        return (<Modal size='small' open={this.state.showModal} closeOnDimmerClick={false} onClose={() => this.closeModal()} id="scrollingModal">
        
        <Modal.Header>
            <div class="ui fluid icon input">
                <input type="text" style={{textAlign: 'center'}} defaultValue={event.title} onChange={(e)=> this.handleUpdate('title', false, null, e)}/>
            </div>
            <br></br>
            <div class="ui fluid icon input" style={{textAlign: 'center'}}>
               <div style={{margin: 'auto'}}>
                <Checkbox toggle defaultChecked={event.allDay} label='All day' style={{float: 'right'}} onClick={(e)=> this.handleUpdate('allDay', true, null, e)}/>
                </div>
             </div>
        </Modal.Header>
        <Modal.Content>
        <Segment style={{color: "#D82866", textAlign: 'center'}} onClick={() => this.setState({renderPicker: true})}> {startDate} - {endDate} </Segment>
        {datePicker}
         <hr></hr>
        <Segment>
            <div class="ui form">
                 <div class="field">
                    <label> Type </label>
                    <div class="field">
                        <Dropdown placeholder='Type' selection options={types} defaultValue={event.subType.toUpperCase()} onChange={(e, data) => this.handleUpdate('subType', false, data, e)}/>
                    </div>
                </div>
                <div class="field">
                    <label> Channel </label>
                    <div class="field">
                        <input type="text" value={channel} onChange={(e)=> this.handleUpdate('channel', false, null, e)}/>
                    </div>
                </div>
                <div class="field">
                    <label> Volume </label>
                    <div class="field">
                        <input type="text" value={volume} onChange={(e)=> this.handleUpdate('volume', false, null, e)}/>
                    </div>
                </div>
                <div class="field">
                    <div class="field">
                        <Form.Field id='form-textarea-control-opinion' control={TextArea} label='Audience' defaultValue={audience} onChange={(e) => this.handleUpdate('audience', false, null, e)} />
                    </div>
                </div>
                <div class="field">
                    <div class="field">
                        <Form.Field id='form-textarea-control-opinion' control={TextArea} label='Offer' defaultValue={offer} onChange={(e)=>this.handleUpdate('offer', false, null, e)} />
                    </div>
                </div>
                <div class="field">
                    <label> Job ID </label>
                    <div class="field">
                        <input type="text" defaultValue={jobId} onChange={(e)=> this.handleUpdate('jobId', false, null, e)}/>
                    </div>
                </div>
            </div>
        </Segment>
        <Message info>
        <Message.Header>Reminder</Message.Header>
        <p>Changes won't be saved until you hit <b><u>Update</u></b></p>
        </Message>
        </Modal.Content> <Modal.Actions>
            { deleteButton }
            <Button negative icon='power off' labelPosition='right' content="Cancel"  onClick={() => this.closeModal()}/>
            { tickButton }
          </Modal.Actions>
        </Modal>)
    }
    
   
    render(){   
        
       if (!_.isEmpty(this.state.testProp)){
        
        let { rendering } = this.state
        let now = moment()
        let testProp = this.state.testProp
        let onDate = this.state.onDate 
        testProp.onDate = moment(onDate, 'YYYY-MM-DD').format()
        
        testProp.eventsRendered = testProp.events.map((event) => { let body = event.body; body.id = event.id; return body } )
        testProp.actualRendered = (rendering.loyalty && rendering.crm) ? testProp.eventsRendered : rendering.crm ? testProp.eventsRendered.filter((event)=> event.subType.toLowerCase() == 'crm') : rendering.loyalty ? testProp.eventsRendered.filter((event)=> event.subType.toLowerCase() == 'loyalty') : [{ title: 'Event Title', start: moment("9999-12-25").toDate(), end: moment("9999-12-25").toDate() }]
           
        
//        let prevCalendar = ( this.state.lastWeekVisible == true ) ? this.myCalendar(testProp) : ''
        let thisCalendar = this.myTacticalCalendar(testProp)
//        let nextCalendar = ( this.state.nextWeekVisible == true ) ? this.myCalendar(testProp) : ''
       
        let eventDetail = ( this.state.currentEvent != null ) ? this.renderEvent(null) : ''
        
//        <Divider horizontal ><h2 class="lw" onClick={() => this.flipVisible('lw')}> Last Week </h2> </Divider>
//                <div> {prevCalendar} </div> <br></br> 
//                <Divider horizontal ><h2 class="tw" onClick={() => this.flipVisible('tw')}> This Week </h2> </Divider>
//                <div> {thisCalendar} </div> <br></br>
//                <Divider horizontal ><h2 class="nw" onClick={() => this.flipVisible('nw')}> Next Week </h2> </Divider>
//                <div> {nextCalendar} </div><br></br> </div>
        
        let legends = ['loyalty','crm']
        
        return (
        
            <div id='tacticalGrid'>
                    <div id="tacticalOptionBar">
                    <div>
                         <h1>Tactical</h1> 
                         <Icon id="icon-outline-out" title="Add new event" className='circular red large add circle' onClick={()=> this.renderNewEvent()}/> 
                         <Icon id="icon-spin" title="Refresh data" className='circular red large refresh' onClick={() => this.props.dispatch(fetchEvents('tactical'))}/> 
                         <br></br>
                         
                     </div>
                    </div>
                    
                    <div style={{textAlign: 'center'}}>
                        <div id='tacticalCalendar'>
                        <div id='datePicker'><DatePicker selected={this.state.onDate} onChange={(date) => this.handleViewChange(date)} /></div>
                        <br></br>   
                            {thisCalendar}
                        </div> 
                        <br></br>
                        <div id='legend'> { legends.map(key => (<Label size='large' id={rendering[key] ? key : key+'-greyedOut'} key={key} onClick={() => this.flipVisible(key)}>
                                {_.upperCase(key)} 
                              </Label> ))} 
                        </div>
                        <br></br>
                    </div>
                    {eventDetail}
            </div>
                
            )
       } else {
           return ( <h2 style={{fontSize: 42, marginLeft: '25px', color: "#D82866"}}> Loading ...  </h2>)
       }
        
            
    }
}