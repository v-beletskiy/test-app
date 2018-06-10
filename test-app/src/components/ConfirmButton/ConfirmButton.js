import React, {Component} from 'react';
import './ConfirmButton.css'
import PropTypes from 'prop-types'

export default class ConfirmButton extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        isChecked: PropTypes.bool,
        isTrue: PropTypes.bool,
        chosenAnswerIndex: PropTypes.number,
        answer_comments: PropTypes.array,
        paginationClicked: PropTypes.bool,
        onConfirmButtonSwitch: PropTypes.func,
        onPaginationClick: PropTypes.func,
        onClearTimer: PropTypes.func
    };

    render() {
        return (
            <div className="control_buttons">
                <button className="control-button confirm-control-button" onClick={this.handleConfirmButton} >
                    Подтвердить ответ
                </button>
            </div>
        )
    }

    handleConfirmButton = (e) => {
        //Отправляем в AnswerOptions событие, чтобы поменялся статус подтверждения isConfirmed
        this.props.onConfirmButtonSwitch(true);
        //!!!!!!Не работает сброс таймера после подтверждения вопроса.
        this.clearTimer();
        this.saveAnswerResult();
    };

    clearTimer = () => {
        this.props.onClearTimer();
    };

    //Записываем кол-во правильных/неправильных ответов в локальное хранилище
    saveAnswerResult = () => {
        if(this.props.isTrue) {
            sessionStorage.numberOfCorrectAnswers++;
        } else {
            sessionStorage.numberOfIncorrectAnswers++;
        }
    };
}
