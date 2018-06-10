import React, {Component} from 'react';
import './ResultComparison.css'
import PropTypes from 'prop-types'

export default class ResultComparison extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        showResultComparison: PropTypes.bool,
        previousResult: PropTypes.string
    };

    render() {
        if(this.props.showResultComparison && this.props.previousResult) {
            return(
                <div className="previous-results-block">
                    <div className="previous-result">Предыдущий результат - {this.props.previousResult}</div>
                </div>
            )
        } else if(this.props.showResultComparison && !this.props.previousResult) {
            return(
                <div className="previous-results-block">
                    <div className="previous-result">Вы прошли тест всего один раз.</div>
                </div>
            )
        } else {
            return null
        }
    }
}