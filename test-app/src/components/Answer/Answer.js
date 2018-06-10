import React, {Component} from 'react';
import './Answer.css'
import AnswerOptions from '../AnswerOptions/AnswerOptions.js'
import AnswerConfirmationResult from '../AnswerConfirmationResult/AnswerConfirmationResult.js'
import data from '../../data/answers_data.json';
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'

export default class Answer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTrue: false,
            isCorrectAnswer: null
        }
    }

    static propTypes = {
        answers: PropTypes.array,
        answer_comments: PropTypes.array,
        questionNumber: PropTypes.number,
        showCommentsIfPaginationClicked: PropTypes.bool,
        onPaginationClick: PropTypes.func,
        paginationClicked: PropTypes.bool,
        onClearTimer: PropTypes.func,
        setTestOver: PropTypes.func,
        isConfirmed: PropTypes.array,
        onChangeIsConfirmed: PropTypes.func,
        isQuestionTimeOver: PropTypes.array
    };

    render() {
        return (
            <div className="answers">
                <AnswerConfirmationResult isCorrectAnswer = {this.state.isCorrectAnswer}/>
                <CSSTransitionGroup
                    transitionName="example"
                    transitionEnterTimeout={300}
                    transitionEnter={true}
                    transitionLeave={false}>
                    <AnswerOptions answers = {this.props['answers']}
                                   answer_comments = {this.props['answer_comments']}
                                   correct_answer = {data[this.props.questionNumber]['correctAnswerData']}
                                   questionNumber = {this.props.questionNumber}
                                   showCommentsIfPaginationClicked = {this.props.showCommentsIfPaginationClicked}
                                   onPaginationClick = {this.props.onPaginationClick}
                                   isTrue = {this.state.isTrue}
                                   onAnswerOptionClick = {this.handleAnswerOptionClick}
                                   paginationClicked = {this.props.paginationClicked}
                                   onClearTimer = {this.onClearTimer}
                                   setTestOver = {this.handleTestOver}
                                   isConfirmed = {this.props.isConfirmed}
                                   isQuestionTimeOver = {this.props.isQuestionTimeOver}
                                   onChangeIsConfirmed = {this.handleChangeIsConfirmed}
                    />
                </CSSTransitionGroup>
            </div>
        )
    }

    //Меняем isTrue в зависимости от того, выбран правильный ответ или нет в AnswerOptions
    handleAnswerOptionClick = (val) => {
        if(val) {
            this.setState({
                isTrue: true
            })
        } else {
            this.setState({
                isTrue: false
            })
        }
    };

    onClearTimer = (e) => {
        this.props.onClearTimer(e);
    };

    handleTestOver = (e) => {
        this.props.setTestOver(e);
    };

    handleChangeIsConfirmed = (e) => {
        this.props.onChangeIsConfirmed(e);
    }
}