import React, {Component} from 'react';
import {render} from 'react-dom';
import './App.css';
import './index.css';
import data from './data/answers_data.json';
import Question from './components/Question/Question.js';
import Answer from './components/Answer/Answer.js';
import QuestionList from './components/QuestionList/QuestionList.js';
import ControlPreviousNext from "./components/ControlPreviousNext/ControlPreviousNext.js";
import AccomplishTestPage from "./components/AccomplishTestPage/AccomplishTestPage.js";
import ProgressBar from "./components/ProgressBar/ProgressBar.js"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionNumber: 0,
            showCommentsIfPaginationClicked: false,
            paginationClicked: false,
            isConfirmed: new Array(data.length).fill(""),        //Вопрос подтвержден нажатием кнопки в ConfirmButton
            isQuestionTimeOver: new Array(data.length).fill(false),   //Массив значений, закончилось ли время, отведенное для каждого вопроса
            isTestOver: null,
            attempt: 0
        };

        //Инициализируем переменные для локального хранения кол-ва правильных/неправильных ответов (в рамках сессии)
        this.initializeStorage();

        //Инициализируем переменную для хранения итоговых данных по завершению теста (в рамках локального хранилища)
        localStorage.setItem('savedResult', '');

        this.timerTime = 30000;     //Время, отведенное для ответа на вопрос, которое отсчитывает таймер
        this.timerLittleTimeLeft = 11;   //Небольшое кол-во оставшегося времени, при кот-м таймер сигнализирует
    }

    render() {
        if(!this.state.isTestOver) {
            return (
                <div className="App" >
                    <header className="App-header">
                        <h1 className="App-title">Математика для дошкольников
                        </h1>
                    </header>
                    <ProgressBar amountOfQuestions = {data.length}
                                 isConfirmed = {this.state.isConfirmed}
                    />
                    <Question question = {data[this.state.questionNumber]['question']}
                              questionNumber = {this.state.questionNumber}
                    />
                    <div className="timer-block">
                        <span>Оставшееся время на вопрос (секунды): </span>
                        <span className="timer"></span>
                    </div>
                    <Answer answers = {data[this.state.questionNumber]['answers']}
                            answer_comments = {data[this.state.questionNumber]['answer_comments']}
                            questionNumber = {this.state.questionNumber}
                            showCommentsIfPaginationClicked = {this.state.showCommentsIfPaginationClicked}
                            onPaginationClick = {this.setPaginationClick}
                            paginationClicked = {this.state.paginationClicked}
                            onClearTimer = {this.clearTimer}
                            setTestOver = {this.handleTestOver}
                            isConfirmed = {this.state.isConfirmed}
                            onChangeIsConfirmed = {this.changeIsConfirmed}
                            isQuestionTimeOver = {this.state.isQuestionTimeOver}
                    />
                    <ControlPreviousNext onControlPreviousClick = {this.setPreviousQuestion}
                                         onControlNextClick = {this.setNextQuestion}
                    />
                    <QuestionList onPaginationClick = {this.setChosenQuestionNumber}
                                  data = {data}
                                  isConfirmed = {this.state.isConfirmed}
                                  questionNumber = {this.state.questionNumber}
                    />
                </div>
            );
        //Если тест завершен, выводить соответствующую страницу со статистикой
        } else {
            return (
                <AccomplishTestPage onRestart = {this.restart}
                                    attempt = {this.state.attempt}
                />
            )
        }
    }



    //БЛОК ТАЙМЕРА//
    //При открытии приложения начинает работать таймер
    componentDidMount() {
        this.setTimer();
        document.addEventListener("onKeyPress", this.handleEnterConfirmButton)
    };

    //Устанавливаем таймер при следующей попытке
    componentDidUpdate(prevProps, prevState) {
        if(prevState.attempt !== this.state.attempt) {
            //Обнуляем сессионное хранилище правильных/неправильных ответов
            this.initializeStorage();
            this.setTimer();
        }
    }

    //Инициализируем переменные для локального хранения кол-ва правильных/неправильных ответов (в рамках сессии)
    initializeStorage = () => {
        sessionStorage.setItem('numberOfCorrectAnswers', '0')
        sessionStorage.setItem('numberOfIncorrectAnswers', '0')
    };

    handleEnterConfirmButton = (e) => {
        console.log("Получилось!")
        if (e.charCode === 13) {
            //Отправляем в AnswerOptions событие, чтобы поменялся статус подтверждения isConfirmed
            this.changeIsConfirmed(true);
            this.clearTimer();
            //this.saveAnswerResult();
        }
    };

    //Устанавливаем таймер
    setTimer() {
        //Запускаем таймер обратного отсчета на определенное кол-во секунд
        this.startTimerID = setInterval( () => this.timeIsOver(), this.timerTime);
        //Определяем секунды текущего времени, переводим в мс и определяем конечное время endTime
        this.startTime = new Date().getSeconds() * 1000;
        this.endTime = +this.startTime + this.timerTime;
        //Выводим, сколько секунд на ответ осталось изначально
        this.questionTimeLeftInitial = ((this.endTime - this.startTime) / 1000);
        document.querySelector('.timer').textContent = this.questionTimeLeftInitial;
        //Каждую секунду будет запускаться ф-ция, отображающая кол-во оставшихся секунд
        this.tick = setInterval(this.showTimeLeft, 1000, this.startTime, this.endTime);
    };

    //Показываем кол-во оставшегося времени на вопрос
    showTimeLeft = () => {
        if((this.endTime - this.startTime) > 0) {
            this.endTime = this.endTime - 1000;
            this.questionTimeLeft = ((this.endTime - this.startTime) / 1000);
            document.querySelector('.timer').innerHTML = this.questionTimeLeft;
        } else {
            clearInterval(this.tick);
        }
        //Если времени осталось мало, окрашиваем блок таймера в другой цвет
        if(this.questionTimeLeft < this.timerLittleTimeLeft && document.querySelector(".timer-block") && document.querySelector(".timer")) {
            document.querySelector(".timer-block").className = "timer-block-time-ends";
            document.querySelector(".timer").classList.add("timer-time-ends");
        }
    };

    //Сбрасываем таймер
    clearTimer() {
        clearInterval(this.startTimerID);
        clearInterval(this.tick);
        //Сброс окрашивания таймера в другой цвет, когда осталось мало времени
        if(document.querySelector(".timer-block-time-ends") && document.querySelector(".timer")) {
            document.querySelector(".timer-block-time-ends").className = "timer-block";
            document.querySelector(".timer").classList.remove("timer-time-ends");
        }
    };

    //По истечении времени на ответ осуществляется переход на следующий вопрос
    timeIsOver = () => {
        this.clearTimer();

        //Копируем массив текущих значений из state, закончилось ли время для каждого вопроса
        let isQuestionTimeOverUpdated = this.state.isQuestionTimeOver.slice();
        //Присваиваем true, что время закончилось для текущего вопроса
        isQuestionTimeOverUpdated[this.state.questionNumber] = true;
        //Копируем массив значений, подтвержден ли вопрос из state
        let isConfirmedUpdated = this.state.isConfirmed.slice();
        //Присваиваем false, что вопрос не подтвержден
        isConfirmedUpdated[this.state.questionNumber] = false;

        this.setState ({
            isQuestionTimeOver: isQuestionTimeOverUpdated
        });

        let amountOfAnswers = data.length;
        //Если вопрос не последний, время для следующего вопроса не закончилось и следующий не подтвержден, переходим на него и ставим таймер
        if(this.state.questionNumber < amountOfAnswers - 1 && !this.state.isQuestionTimeOver[this.state.questionNumber + 1] && !this.state.isConfirmed[this.state.questionNumber + 1]) {
            this.setTimer();
            this.setState ({
                questionNumber: this.state.questionNumber + 1,
                paginationClicked: true,
                isConfirmed: isConfirmedUpdated,
            });
        } else {
            this.clearTimer();
            this.showTimeEnd();
        }
    };

    //Вывод сообщения, если время на вопрос закончилось.
    showTimeEnd = () => {
        document.querySelector('.timer').textContent = "Время истекло."
    };
    //КОНЕЦ БЛОКА ТАЙМЕРА//



    //БЛОК ПЕРЕКЛЮЧЕНИЯ НА ПРЕДЫДУЩИЙ/СЛЕДУЮЩИЙ ВОПРОС//
    //Меняем вопрос, если выбрали предыдущий
    setPreviousQuestion = () => {
        this.clearTimer();

        if(this.state.questionNumber >= 1) {
            this.setState ({
                questionNumber: this.state.questionNumber - 1,
                paginationClicked: true,
            }, this.setPrevTimer);
        }
    };

    //Устанавливаем таймер после нажатия на кнопку предыдущего вопроса (после того, как обновился номер вопроса в setPreviousQuestion)
    setPrevTimer = () => {
        //Если время на вопрос (предыдущий) закончилось и вопрос подтвежден, таймер заново не запускается.
        if(!this.state.isQuestionTimeOver[this.state.questionNumber] && !this.state.isConfirmed[this.state.questionNumber]) {
            this.setTimer();
            //Иначе показываем сообщение, что не осталось времени.
        } else {
            this.showTimeEnd();
        }
    };

    //Меняем вопрос, если выбрали следующий
    setNextQuestion = () => {
        this.clearTimer();

        let amountOfAnswers = data.length;
        if(this.state.questionNumber < amountOfAnswers - 1) {
            this.setState ({
                questionNumber: this.state.questionNumber + 1,
                paginationClicked: true,
            }, this.setNextTimer)
        } else {
            //Переходим на последний вопрос
            this.setState ({
                questionNumber: amountOfAnswers - 1,
                paginationClicked: true
            }, this.setNextTimer)
        }
    };

    //Устанавливаем таймер после нажатия на кнопку следующего вопроса (после того, как обновится номер вопроса в setNextQuestion)
    setNextTimer = () => {
        //Если время следующего вопроса не закончилось и он не подтвержден, запускаем таймер
        if(!this.state.isQuestionTimeOver[this.state.questionNumber] && !this.state.isConfirmed[this.state.questionNumber]) {
            this.setTimer();
            //Иначе показываем сообщение, что не осталось времени.
        } else {
            this.showTimeEnd();
        }
    };
    //КОНЕЦ БЛОКА ПЕРЕКЛЮЧЕНИЯ НА ПРЕДЫДУЩИЙ/СЛЕДУЮЩИЙ ВОПРОС//



    //БЛОК ПАГИНАЦИИ//
    //Обрабатываем кликнутую страницу пагинации от QuestionList
    setChosenQuestionNumber = (chosenQuestionNumber) => {
        //Передается номер вопроса, на который кликнули, а тут устанавливаем номер вопроса из массива
        let updatedChosenQuestionNumber = chosenQuestionNumber - 1;
        this.clearTimer();

        this.setState ({
            questionNumber: updatedChosenQuestionNumber,
            showCommentsIfPaginationClicked: !this.state.showCommentsIfPaginationClicked,
            paginationClicked: true,
        }, this.setPaginationTimer);
    };

    //Устанавливаем таймер после нажатия на кнопку пагинации (после того, как обновится номер вопроса в setChosenQuestionNumber)
    setPaginationTimer = () => {
        if(!this.state.isQuestionTimeOver[this.state.questionNumber] && !this.state.isConfirmed[this.state.questionNumber]) {
            this.setTimer();
        } else {
            this.showTimeEnd();
        }
    };

    //Меняем состояние paginationClicked (для AnswerOptions.js, ConfirmButton.js)
    setPaginationClick = (e) => {
        if(e) {
            this.setState ({
                paginationClicked: true,
            });
        } else {
            this.setState ({
                paginationClicked: false,
            });
        }
    };
    //КОНЕЦ БЛОКА ПАГИНАЦИИ//



    //Переход на страницу итогов AccomplishTestPage при завершении теста
    handleTestOver = () => {
        this.setState ({
            isTestOver: true,
        });
        this.clearTimer();
    };

    //Меняем статус вопроса на подтвержденный и отмечаем, что время вышло (по нажатию на кнопку "Подтвердить ответ")
    changeIsConfirmed = () => {
        //Создаем массив isConfirmed, isQuestionTimeOver, что вопрос подтвержден и время на него вышло.
        let isConfirmedUpdated = this.state.isConfirmed.slice();
        isConfirmedUpdated[this.state.questionNumber] = true;
        let isQuestionTimeOverUpdated = this.state.isQuestionTimeOver.slice();
        isQuestionTimeOverUpdated[this.state.questionNumber] = true;

        this.clearTimer();

        //Если время вопроса не вышло, делаем его подтвержденным и ставим, что время на этот вопрос вышло
        if(!this.state.isQuestionTimeOver[this.state.questionNumber]) {
            this.setState({
                isConfirmed: isConfirmedUpdated,
                isQuestionTimeOver: isQuestionTimeOverUpdated
            });
        }
    };

    //Обновляем компонент для следующей попытки прохождения теста
    restart = (attemptNumber) => {
        this.setState({
            attempt: attemptNumber,
            questionNumber: 0,
            isTestOver: null,
            isConfirmed: new Array(data.length).fill(""),        //Вопрос подтвержден нажатием кнопки в ConfirmButton
            isQuestionTimeOver: new Array(data.length).fill(false)
        })
    }
}

render(<App />, document.getElementById('root'));