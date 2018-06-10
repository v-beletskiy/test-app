import React, {Component} from 'react';
import './QuestionList.css'
import PropTypes from 'prop-types'

export default class QuestionList extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        onPaginationClick: PropTypes.func,
        data: PropTypes.array,
        isConfirmed: PropTypes.array,
        questionNumber: PropTypes.number
    };

    render() {
        return (
            <div className = "Question-list">
                {this.props.data.map((value, index) =>
                    <li onClick = {this.setChosenQuestionNumber}
                        key = {value.id}
                        //Если в массиве isConfirmed для текущего вопроса true, т.е. была нажата кнопка Подтверждения вопроса,
                        //то вызывается метод, который слилизует его подтвержденным; если нет, то обычным.
                        //!!!!!!!!!!!!добавить this.props.questionNumber === index
                        className = {this.props.isConfirmed[index] ? "Question-list-item-confirmed" : "Question-list-item"}>
                            <span className="question-list-number">{index + 1}</span>
                    </li>)}
            </div>
        )
    }

    //Сразу после загрузки приложения делаем первый вопрос активным
    componentDidMount() {
        if(this.props.questionNumber === 0) {
            this.highlightFirstQuestion();
        }
    }

    //При переключении на следующий вопрос (когда закончится время либо кнопками) стилизуем вопрос активным
    componentWillReceiveProps(nextProps) {
        if(nextProps.questionNumber !== this.props.questionNumber) {
            this.highlightQuestion(nextProps.questionNumber);
        }
    }

    //Reverse data flow - по клику передается номер кликнутой страницы пагинации в родительский index.js
    setChosenQuestionNumber = (e) => {
        this.props.onPaginationClick(e.target.textContent);
        //Вызываем сброс выделения стилей
        this.resetHighlightingQuestion();
        //Если вопрос, по которому кликнули, не подтвержден, стилизуем его активным
        if(e.currentTarget.className !== "Question-list-item-confirmed") {
            this.highlightChosenQuestion(e);
        }
    };

    //Стилизуем кликнутый вопрос, делая его активным
    highlightChosenQuestion = (e) => {
        this.resetHighlightingQuestion();
        e.currentTarget.className = "Question-list-item-active";
    };

    //Стилизуем вопрос актинвым при переходе на предыдущую/следующую страницу
    highlightQuestion = (nextQuestionNumber) => {
        //При переходе на след. вопрос текущий делаем обычным, не активным
        let Question = document.querySelector(".Question-list");
        let questionListLi = Question.children;
        if(questionListLi[this.props.questionNumber].className !== "Question-list-item-confirmed") {
            questionListLi[this.props.questionNumber].className = "Question-list-item"
        }
        //Следующий вопрос делаем активным, если не стилизован подтвержденным
        if(questionListLi[nextQuestionNumber].className !== "Question-list-item-confirmed") {
            questionListLi[nextQuestionNumber].className = "Question-list-item-active";
        }
    };

    //Делаем первый вопрос активным (сразу после монтирования компонента)
    highlightFirstQuestion = () => {
        //querySelector выберет первый элемент с таким классом
        let firstQuestion = document.querySelector(".Question-list-item");
        //Если вопрос не подтвержден, выделяем его активным
        if(firstQuestion.className !== "Question-list-item-confirmed") {
            firstQuestion.className = "Question-list-item-active";
        }
    };

    //Сбрасываем выделение у всех вопросов, кроме подтвержденных (Question-list-item-confirmed),
    // выбирая всех потомков у дочернего элемента li
    resetHighlightingQuestion = () => {
        let Question = document.querySelector(".Question-list");
        let questionListLi = Question.children;
        for(let i = 0; i < questionListLi.length; i++) {
            if(questionListLi[i].className !== "Question-list-item-confirmed") {
                questionListLi[i].className = "Question-list-item";
            }
        }
    };
}