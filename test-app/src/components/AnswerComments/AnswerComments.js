import React, {Component} from 'react';
import './AnswerComments.css'
import PropTypes from 'prop-types'

export default class AnswerComments extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        isChecked: PropTypes.bool,
        isTrue: PropTypes.bool,
        chosenAnswerIndex: PropTypes.number,
        answer_comments: PropTypes.array,
        paginationClicked: PropTypes.bool,
        isConfirmed: PropTypes.array,
        questionNumber: PropTypes.number
    };

    //Комментарии показываются только, если выбран ответ + не перешли по пагинации +
    //разные комментарии для правильных/неправильных ответов.
    render() {
        return (
            <div>
                {this.props.isConfirmed[this.props.questionNumber] && this.props.isChecked && !this.props.isTrue && !this.props.paginationClicked ? this.getIncorrectAnswerComment() : null}
                {this.props.isConfirmed[this.props.questionNumber] && this.props.isChecked && this.props.isTrue && !this.props.paginationClicked ? this.getCorrectAnswerComment() : null}
            </div>
        )
    };

    //Показываем комментарий для неправильного ответа
    getIncorrectAnswerComment = () => {
        return (
            <div className="answer_comment">
                <p className="incorrect_answer_comment_header">Комментируем ваш ответ</p>
                <p className="incorrect_answer_comment_text">{this.props.answer_comments[this.props.chosenAnswerIndex]}</p>
            </div>
        );
    };

    //Показываем комментарий для правильного ответа
    getCorrectAnswerComment = () => {
        return (
            <div className="answer_comment">
                <p className="correct_answer_comment_header">Комментируем ваш ответ</p>
                <p className="correct_answer_comment_text">Да, все верно!</p>
            </div>
        )
    };
}

