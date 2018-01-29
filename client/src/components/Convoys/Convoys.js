import React, { Component } from 'react';
import './Convoys.css';
import dummydata from "./dummydata.json";
import icons from './icons.json';
import API from "../../utils/API";
import { firebaseApp, db } from '../../firebase';
import firebase from 'firebase';
import SignUp from "../SignUp/SignUp";
import Chip from 'material-ui/Chip';


var Link = require('react-router-dom').Link;

var NavLink = require('react-router-dom').NavLink;

class Convoys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dummydata: [],
            email: '',
            emails: [],
            icons: null,
            convoyName: '',
            newEmails: [],
            username: '',
            sgEmail: {},
           
            
        };
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    componentDidMount() {
        console.log("props: ", this.props.user.uid);
        var instance = window.M.Modal.init(this.modal);
        // var icon = icons[Math.floor(Math.random()*icons.length)];
        
      
            this.setState({icons});
    
        // console.log('icon ' + icon);
        // this.setState({icon});
        // var icon = Math.floor(Math.random() * (1 + Icons.length - 1));
        // console.log(JSON.stringify(icon));
        
        
        var convoydata = dummydata.map((data) => {
            console.log(data);
            
            return {
                convoyName: data.name,
            };
        });
        // console.log(convoydata);
        this.setState({dummydata : convoydata});
        console.log('convoy name: ' + JSON.stringify(convoydata));
    }
  
    
    handleDelete = data => () => {
        const emails = [...this.state.emails];
        const emailToDelete = emails.indexOf(data);
        emails.splice(emailToDelete, 1);
        this.setState({ emails });
      };
      
    handleInputConvoy = event => {
        this.setState({ convoyName: event.target.value });
    }
    
    handleInputEmail = event => {
        this.setState({ email: event.target.value });
    }
    
    
    handleonKeyPress = (event) => {
      if (event.key === 'Enter') {
          let emails = [...this.state.emails];
          emails.push({
              id: emails.length,
              label: this.state.email,
              convoyName: this.state.convoyName,
          });
          this.setState({ emails, email: '' });
      }
    }

    
    startSendGrid = () => {

      API.postEmail()
        .then(res => this.setState({ sgEmail : res.data }))
        .catch(err => console.log(err));
    };
  
    saveAndUpdate = (uid, name, members) => {
        // if email input field is not empty (!this.state.email), push it to emails array
        if (this.state.email) {
            var emails = [...this.state.emails]
            emails.push({
                id: emails.length,
                label: this.state.email,
                convoyName: this.state.convoyName,
            });
            console.log(emails)
            this.setState({ emails});
        }
        this.startSendGrid();
        
        // // A convoy entry.
        const convoyData = {
            name: this.state.convoyName,
            uid: this.props.user.uid
        };
        // Get a key for a new Convoy.
        const newConvoyKey = db.ref().child('convoys').push().key;
        // Write the new convoy's data simultaneously in the convoys list and the profiles list.
        var updates = {};
        //add the convoy's name to the convoy
        updates['/convoys/' + newConvoyKey + '/name'] = convoyData.name;
        //add the current user UID to the members object
        updates['/convoys/' + newConvoyKey + '/members/' + convoyData.uid] = true;
        //add the convoykey to the current user's profile
        updates['/profiles/' + convoyData.uid + '/convoys/' + newConvoyKey] = true;
    
        
        return db.ref().update(updates).then(this.setState({ convoyName: '', email: '', emails: []}, () =>console.log("wiped state")));
    };
   

    
    render() {
        var dummydata = this.state.dummydata;
        return (

            <div>
                <nav>
                    <div className="nav-wrapper">
                        <div href="#" className="brand-logo center">My Convoys</div>
                        <ul id="nav-mobile" className="right">
                            <li>
                                <NavLink to='/signout'>Sign Out</NavLink>
                            </li>              
                        </ul>
                    </div>
                </nav>
                
                <ul className='collection'>
    
                    {dummydata.map((data) => {
                        return (
                                <Link to={{pathname: '/map'}}  key={data.convoyName}>
                                    <li className='collection-item avatar'>
                                        {this.state.icons.map((oneIcon) => {
                                            // console.log('icon: ' +  oneIcon);
                                            return (
                                                <img src={oneIcon} alt='car avatar' className='circle'/>
                                            );
                                        })}
                                        {/*<img src={icons[Math.floor(Math.random()*icons.length)]} alt="" class="circle"/>*/}
                                        <span class="title">
                                            {data.convoyName}
                                        </span>
                                        <p id='p'>
                                            First Name 
                                            <br/>
                                            Second Name
                                        </p>
                                        <a href="#!" class="secondary-content"><i class="material-icons">chevron_right</i></a>

                                    </li>
                                    <div className='divider'></div>
                                </Link>
                        );
                    })}
                
                </ul>
                
                <div className='container'>
            
                    <div className='row'>
                        <div className='col s12'>
                            
                            {/*<ul className="collection">
                              <li className="collection-item">
                              <Link to={{pathname: '/map'}}>Convoy I</Link>
                              </li>
                            </ul>*/}
              

                        </div>
                    </div>  
                  
                    <div className='row'>
                        <div className='col s8 offset-s2'>
                            <button data-target="modal1" className="btn modal-trigger red">New Convoy</button>
                          
                            <div id="modal1" className="modal" ref={ (modal) => this.modal = modal }>
                                <div className="modal-content">
                                    <h4>New Convoy</h4>
                                    <form>
                                        <input 
                                            placeholder="Convoy Name" 
                                            id="convoyName" 
                                            className="validate" 
                                            value={this.state.convoyName}
                                            onChange={this.handleInputConvoy}
                         
                                        />
                                        <input
                                            placeholder="email"
                                            className="inviteEmail validate"
                                            value={this.state.email}
                                            onChange={this.handleInputEmail}
                                            onKeyPress={this.handleonKeyPress}
                                        />
                                        {
                                            this.state.emails.map(data => {
                                              return (
                                                    <Chip
                                                    key={data.id}
                                                    label={data.label}
                                                      onDelete={this.handleDelete(data)}
                                                    />
                                              );
                                            })
                                        }                                               
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat" onClick={() => this.saveAndUpdate()}>Create</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Convoys;
