import React, {Component} from 'react';
import './ControlPreviousNext.css'
import PropTypes from 'prop-types'

export default class ControlPreviousNext extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        onControlPreviousClick: PropTypes.func,
        onControlNextClick: PropTypes.func
    };

    render() {
        return (
            <div className="navigation-buttons">
                <button className="control-button button-previous" onClick={this.handleControlButtonPrevious}>Предыдущий вопрос</button>
                <button className="control-button" onClick={this.handleControlButtonNext}>Следующий вопрос</button>
            </div>
        )
    }

    handleControlButtonPrevious = (previousQuestion) => {
        this.props.onControlPreviousClick(previousQuestion);
    };

    handleControlButtonNext = (nextQuestion) => {
        this.props.onControlNextClick(nextQuestion);
    };
}
