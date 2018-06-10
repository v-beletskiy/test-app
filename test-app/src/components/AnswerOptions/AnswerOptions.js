import React, {Component} from 'react';
import './AnswerOptions.css'
import PropTypes from 'prop-types'
import AnswerComments from "../AnswerComments/AnswerComments.js"
import ConfirmButton from "../ConfirmButton/ConfirmButton.js"
import AccomplishTestButton from "../AccomplishTestButton/AccomplishTestButton.js"

export default class AnswerOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: null,           //для вывода комментариев, если нажали по варианту ответа
            chosenAnswerIndex: null,   //порядковый номер элемента массива, соответствующий выбранному варианту ответа
        };
    }

    static propTypes = {
        answers: PropTypes.array,
        answers_comments: PropTypes.array,
        correct_answer: PropTypes.number,
        questionNumber: PropTypes.number,
        showCommentsIfPaginationClicked: PropTypes.bool,
        onPaginationClick: PropTypes.func,
        isTrue: PropTypes.bool,
        onAnswerOptionClick: PropTypes.func,
        paginationClicked: PropTypes.bool,
        onClearTimer: PropTypes.func,
        setTestOver: PropTypes.func,
        isConfirmed: PropTypes.array,
        isQuestionTimeOver: PropTypes.array,
        onChangeIsConfirmed: PropTypes.func
    };

    //Обнуляем рамки вокруг всех вариантов ответов, если перешли на другую страницу пагинации
    componentWillReceiveProps(nextProps) {
        if(nextProps.showCommentsIfPaginationClicked !== this.props.showCommentsIfPaginationClicked) {
            this.setState({
                isChecked: false
            });

            //Ставим paginationClicked в index.js на true
            this.handlePaginationClick(true);
        }
    };

    render() {
        let answerOptionsItems = this.props.answers.map((answer) =>
            <div key = {answer} onClick = {this.checkAnswer} className="answer_option">{answer}</div>);
        return (
            <div className="answer_options_block" >Варианты ответов<br/>
                <div className="answer-items">{answerOptionsItems}</div>
                <AnswerComments isChecked = {this.state.isChecked}
                                isTrue = {this.props.isTrue}
                                chosenAnswerIndex = {this.state.chosenAnswerIndex}
                                answer_comments = {this.props['answer_comments']}
                                paginationClicked = {this.props.paginationClicked}
                                isConfirmed = {this.props.isConfirmed}
                                questionNumber = {this.props.questionNumber}
                />
                <div className="answer-options-buttons">
                    <ConfirmButton  isChecked = {this.state.isChecked}
                                    isTrue = {this.props.isTrue}
                                    chosenAnswerIndex = {this.state.chosenAnswerIndex}
                                    answer_comments = {this.props['answer_comments']}
                                    paginationClicked = {this.props.paginationClicked}
                                    onConfirmButtonSwitch = {this.handleConfirmButton}
                                    onPaginationClick = {this.handlePaginationClick}
                                    onClearTimer = {this.handleOnClearTimer}
                    />
                    <AccomplishTestButton setTestOver = {this.handleTestOver} />
                </div>
            </div>
        )
    };

    //Проверка выбранного варианта ответа
    checkAnswer = (e) => {
        //Выполняется проверка, если вопрос не подтвержден и время на вопрос не вышло
        if(!this.props.isConfirmed[this.props.questionNumber ] && !this.props.isQuestionTimeOver[this.props.questionNumber]) {
            //При клике на вариант ответа делаем его isChecked, обнуляем индекс выбранного варианта в массиве
            this.setState({
                isChecked: true,
                chosenAnswerIndex: null,
            });

            //Ставим paginationClicked в index.js на false
            this.handlePaginationClick(false);
            //Ставим isTrue в Answer на false
            this.handleAnswerOptionClick(false);

            //Убираем выделение подтвержденного вопроса (убираем класс answer_option_confirmed)
            let parent_answer_div = e.nativeEvent.target.parentNode;
            let confirmed_questions = parent_answer_div.querySelectorAll('.answer_option_confirmed');
            for(let i = 0; i < confirmed_questions.length; i++) {
                confirmed_questions[i].classList.add("answer_option");
                confirmed_questions[i].classList.remove("answer_option_confirmed");
            }

            //Получаем корректный ответ из json файла из props и выбранное значение приводим к числу
            let correctAnswer = this.props.correct_answer;
            let chosenAnswer = +e.target.textContent;

            //Возвращаем порядковый номер элемента массива, соответствующий выбранному варианту ответа
            let chosenAnswerIndex = this.props.answers.indexOf(chosenAnswer);
            this.setState({
                chosenAnswerIndex: chosenAnswerIndex
            });

            //Стилизуем выбранный ответ, проверяя его на правильность.
            if(chosenAnswer === correctAnswer) {
                e.target.classList.remove("answer_option");
                e.target.classList.add("answer_option_confirmed");
                //Ставим isTrue в Answer на true
                this.handleAnswerOptionClick(true);
            } else {
                e.target.classList.remove("answer_option");
                e.target.classList.add("answer_option_confirmed");
                //Ставим isTrue в Answer на false
                this.handleAnswerOptionClick(false);
            }
        }
    };

    //Меняем статус вопроса isConfirmed в index.js на подтвержденный
    handleConfirmButton = (e) => {
        this.props.onChangeIsConfirmed(e);
    };

    handlePaginationClick = (e) => {
        this.props.onPaginationClick(e);
    };

    handleAnswerOptionClick = (e) => {
        this.props.onAnswerOptionClick(e);
    };

    handleOnClearTimer = (e) => {
        this.props.onClearTimer(e);
    };

    handleTestOver = (e) => {
        this.props.setTestOver(e);
    };
}