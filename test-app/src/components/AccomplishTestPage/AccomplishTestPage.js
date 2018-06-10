import React, {Component} from 'react';
import './AccomplishTestPage.css'
import answers from '../../data/answers_data.json';
import ResultButtons from "../ResultButtons/ResultButtons.js"
import ResultComparison from "../ResultComparison/ResultComparison.js"
import PropTypes from 'prop-types'

export default class AccomplishTestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPreviousResults: false,
            previousResult: null
        };
        this.yourScore = 0;
    }

    static propTypes = {
        onRestart: PropTypes.func,
        attempt: PropTypes.number
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Математика для дошкольников
                    </h1>
                </header>
                <div className="accomplish-test-page">
                    <p className="test-end-notification">Тест завершен!</p>
                    <div className="correct-incorrect-answers-block">
                        <p className="correct-answers">Правильных ответов: {sessionStorage.getItem('numberOfCorrectAnswers')}</p>
                        <p className="incorrect-answers">Неправильных ответов: {sessionStorage.getItem('numberOfIncorrectAnswers')}</p>
                    </div>
                    <p className="test-end-notification">Результат: {this.getYourResult()} %</p>

                    <ResultComparison showResultComparison = {this.state.showPreviousResults}
                                      previousResult = {this.state.previousResult}
                    />

                </div>
                <div>
                    <ResultButtons yourResult = {this.getYourResult()}
                                   onRestart = {this.props.onRestart}
                                   attempt = {this.props.attempt}
                                   onShowPreviousResultsChange = {this.changeShowPreviousResults}
                    />
                </div>
            </div>
        )
    }

    //Возвращаем процент правильно отвеченных вопросов, сохраняя его в this.yourScore
    getYourResult = () => {
        return (
            this.yourScore = Math.round( ( (+sessionStorage.getItem('numberOfCorrectAnswers') ) / answers.length) * 100)
        )
    };

    //При клике на кнопку сравнения с предыдущим результатом получаем пред. рез-т от ResultButton
    changeShowPreviousResults = (show, previousResult) => {
        this.setState({
            showPreviousResults: show,
            previousResult: previousResult
        })
    }
}