import React, {Component} from 'react';
import './AccomplishTestButton.css'
import '../AccomplishTestPage/AccomplishTestPage.js'
import PropTypes from 'prop-types'

export default class AccomplishTestButton extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        setTestOver: PropTypes.func
    };

    render() {
        return (
            <div className="accomplish_test" >
                <button className="control-button" onClick={this.handleAccomplishTest} >
                    Завершить тест
                </button>
            </div>
        )
    }

    //Передаем, что тест завершен, в index.js
    handleAccomplishTest = () => {
        this.props.setTestOver(true);
    }
}