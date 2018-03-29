import React from "react";
import { connect } from "react-redux";
import BigCalendar from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import { Table, Button, Divider, Modal, Label, Input, Segment, Menu } from "semantic-ui-react"
import '../../css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Tactical from './tacticalCalendar'
import Owned from './ownedCalendar'
import Market from './marketCalendar'

BigCalendar.momentLocalizer(moment)

export default class Layout extends React.Component { 
    
    constructor() {
    super()
    this.state = { lastWeekVisible: true, thisWeekVisible: true, nextWeekVisible: true, showModal: false, currentEvent: null, onPage: 'market'}
    
    }
    
    componentWillMount(){
        this.flipVisible = this.flipVisible.bind(this)
        this.renderMenu = this.renderMenu.bind(this)
    }
    
    flipVisible = (week) => {
        
        let cstate = this.state
        switch(week){
            case 'lw':
                cstate.lastWeekVisible = !cstate.lastWeekVisible
                this.setState({cstate})
                break;
            case 'tw':
                cstate.thisWeekVisible = !cstate.thisWeekVisible
                this.setState({cstate})
                break;
            case 'nw':
                cstate.nextWeekVisible = !cstate.nextWeekVisible
                this.setState({cstate})
                break;
            default: 
                break;
        }
    }
    
    handleItemClick = (item) => {
        this.setState({onPage: item})
    }
    
    renderMenu = () => {
        let { onPage } = this.state 
        return (<Menu stackable size='massive' id="mainMenu">
            <Menu.Item>
              <img src='../../img/tab.png' />
            </Menu.Item>
        <div id='mainMenuOptionBar'>
            <Menu.Item
              name='Tactical'
              active={onPage === 'tactical'}
              onClick={() => this.handleItemClick('tactical')}
            >
              Tactical
            </Menu.Item>

            <Menu.Item
              name='Owned'
              active={onPage === 'owned'}
              onClick={() => this.handleItemClick('owned')}
            >
              Owned
            </Menu.Item>

            <Menu.Item
              name='Market'
              active={onPage === 'market'}
              onClick={() => this.handleItemClick('market')}
            >
              Market
            </Menu.Item>
            <Menu.Item
              name='TBA'
              active={onPage === 'TBA'}
              onClick={() => this.handleItemClick('TBA')}
            >
              TBA
            </Menu.Item>
        </div>
      </Menu>)
    }
        
    render(){     
        
//        let prevCalendar = ( this.state.lastWeekVisible == true ) ? this.myCalendar(testProp) : ''
        let menu = this.renderMenu() 
        let { onPage } = this.state
        let calendar = onPage == 'tactical' ? <Tactical /> : onPage == 'owned' ? <Owned /> : onPage == 'market' ? <Market /> : ''
//        let nextCalendar = ( this.state.nextWeekVisible == true ) ? this.myCalendar(testProp) : ''

// <div> {tacticalCalendar} </div> 
// <div> {ownedCalendar} </div>
        
//        <Divider horizontal ><h2 class="lw" onClick={() => this.flipVisible('lw')}> Last Week </h2> </Divider>
//                <div> {prevCalendar} </div> <br></br> 
//                <Divider horizontal ><h2 class="tw" onClick={() => this.flipVisible('tw')}> This Week </h2> </Divider>
//                <div> {thisCalendar} </div> <br></br>
//                <Divider horizontal ><h2 class="nw" onClick={() => this.flipVisible('nw')}> Next Week </h2> </Divider>
//                <div> {nextCalendar} </div><br></br> </div>
        
        return (
        <div style={{overflow: "auto", height: "900px"}} > 
                  <div>
                       {menu}
                       {calendar}
                   </div>
        </div>
                
            )
            
    }
}