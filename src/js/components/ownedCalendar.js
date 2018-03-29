import React from "react";
import { connect } from "react-redux";
import BigCalendar from 'react-big-calendar';
//import DatePicker from 'react-datepicker';
import Datetime from 'react-datetime';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../actions/eventActions"
import { Table, Button, Divider, Modal, Label, Input, Segment, Form, TextArea, Dropdown, Grid, Icon, Confirm, Checkbox, Message, List } from "semantic-ui-react"
import '../../css/custom.css'
import moment from 'moment';
import _ from 'lodash'; 


export default class Owned extends React.Component { 
    
    constructor() {
    super()
    this.state = { showModal: false,
                  currentEvent: null,
                  showSegment: false,
                  currentHover: null,
                  currentTacticalView: 'week',
                  renderPicker: false,
                  setDateError: false,
                  testProp: {}}
    }
    
    componentWillMount(){
        
        this.closeModal = this.closeModal.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.renderEvent = this.renderEvent.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.checkDateChange = this.checkDateChange.bind(this)
        this.submitEvent = this.submitEvent.bind(this)
    }
    
    
    componentWillReceiveProps(newProps){
        if (newProps.events){
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
        this.props.dispatch(fetchEvents())
    }
    
    deleteEvent = () => { let { currentEvent } = this.state; this.props.dispatch(deleteEvent(currentEvent)) }
    
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
    
    handleUpdate = (e) => { 
        
    
    let cdata = this.state.currentEvent
    let newData = e.target.value.split('\n')
    cdata.body.content = newData
    this.setState({currentEvent: cdata})
    
    }
    
    
    renderEvent = () => {
        
        let event = this.state.currentEvent
//        let startDate = event.body.start.toString().replace('GM', ' ').replace('T+1100', '').replace('AEDT','').replace('()','')
//        let endDate = event.body.end.toString().replace('GM', ' ').replace('T+1100', '').replace('AEDT','').replace('()','')
        let startDate = moment().toDate().toString().replace('GM', ' ').replace('T+1100', '').replace('AEDT','').replace('()','')
        let endDate = moment().toDate().toString().replace('GM', ' ').replace('T+1100', '').replace('AEDT','').replace('()','')
        let types = [{ key: 'SPORTS', value: 'SPORTS', text: 'SPORTS BLOG' },
                     { key: 'RACING', value: 'RACING', text: 'RACING BLOG' }]
        let { subType, content } = event.body
        let datePicker = this.state.renderPicker == true ? this.renderDatePicker() : null 
        let deleteButton = <Button normal icon='recycle' labelPosition='right' content='Delete' onClick={() => { this.deleteEvent(); ; this.closeModal() } }/>
        let tickButton = <Button positive icon='checkmark' labelPosition='right' content='Update' onClick={() => { this.submitEvent(); this.closeModal() } }/>
        
        return (<Modal size='small' open={this.state.showModal} closeOnDimmerClick={false} onClose={() => this.closeModal()} id="scrollingModal">
        
        <Modal.Header>
            <div class="ui fluid icon input">
                {subType}
            </div>
        </Modal.Header>
        <Modal.Content>
        <Segment style={{color: "#D82866", textAlign: 'center'}} onClick={() => this.setState({renderPicker: true})}> {startDate} - {endDate} </Segment>
        <Segment stacked>
            <div class="ui form">
               <div class="field">
                    <div class="field">
                      <Form.Field id='form-textarea-control-opinion' control={TextArea} label='Info' defaultValue={content.join('\n')} onChange={(e) => this.handleUpdate(e)}/> 
                    </div>
                </div>
            </div>
        </Segment>
        {datePicker}
         <hr></hr>
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
        
//       if (!_.isEmpty(this.state.testProp)){
        
//        let now = moment()
//        let testProp = this.state.testProp
//        testProp.eventsRendered = testProp.events.map((event) => { let body = event.body; body.id = event.id; return body } )
         console.log(this.state.currentEvent)
       
        let eventDetail = ( this.state.currentEvent != null ) ? this.renderEvent(null) : ''
    
        let legends = ['loyalty','crm']
        
        let testProp = {
            id: 1,
            body: {
            type: 'owned',
            subType: 'SPORTS BLOG',
            content: ['A-league, EPL, NBA, AFL, NRL +2 articles of our choice', 'hey hey hey'],
            start: 'DATE', 
            end: 'DATE'   
            }
        }
        
        let sportBlogs = testProp.body.content.map((event)=> (
                                     <li>
                                         {event}
                                     </li>
                                     ))
                    
        return (
        
            <div id='tacticalGrid'>
                    <br></br> 
                    {eventDetail}
                    <div style={{textAlign: 'center'}}>
                        <div id='tacticalCalendar'>   
                            <Table celled inverted selectable>
                                <Table.Header style={{textAlign: 'center', fontSize: '32'}}>
                                  <Table.Row>
                                    <Table.HeaderCell colSpan='3'>Owned Content</Table.HeaderCell>
                                  </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                  <Table.Row>
                                    <Table.Cell collapsing style={{fontSize: '19px'}}>
                                      <Icon name='pencil alternate' /> SPORTS BLOG
                                    </Table.Cell>
                                    <Table.Cell onClick={() => this.setState({showModal: true, currentEvent: testProp})}>
                                        <ul>
                                            {sportBlogs}
                                        </ul>
                                    </Table.Cell>
                                  </Table.Row>
                                  <Table.Row>
                                    <Table.Cell collapsing style={{fontSize: '19px'}}>
                                      <Icon name='pencil alternate' /> RACING BLOG
                                    </Table.Cell>
                                    <Table.Cell>
                                        <ul>
                                            {sportBlogs}
                                        </ul>
                                    </Table.Cell>
                                  </Table.Row>
                                </Table.Body>
                            </Table>
                        </div> 
                 </div>
            </div>
                
            )
       }            
}
