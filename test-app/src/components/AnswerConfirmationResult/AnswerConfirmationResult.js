import React, {Component} from 'react';
import PropTypes from 'prop-types'

export default class AnswerConfirmationResult extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        isCorrectAnswer: PropTypes.bool
    };

    render() {
        if (this.props.isCorrectAnswer === null) {
            return null
        } else if(this.props.isCorrectAnswer)
            return (
                <div>
                    Правильно!
                </div>
            );
            return (
                <div>
                    Неправильно.
                </div>
            )
    }
}