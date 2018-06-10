import React, {Component} from 'react';
import './ResultButtons.css'
import PropTypes from 'prop-types'

export default class ResultButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            previousResult: "",
            saveResultsPressed: null
        };
        this.geo = null; //сюда записываются данные геолокации при сохранении результата
        this.previousResult = null; //сюда записывается предыдущий результат при сохранении результата
    }

    static propTypes = {
        yourResult: PropTypes.number,
        onRestart: PropTypes.func,
        attempt: PropTypes.number,
        onShowPreviousResultsChange: PropTypes.func
    };

    render() {
        return (
            <div className="result-controls">
                <div className="result-control-buttons">
                    <input type = "text" value = {this.state.name} onChange = {this.handleNameInput} placeholder="Как тебя зовут?" />
                    <button className="result-control-button save-result-button" onClick = {this.handleLocation} >
                        Сохранить результат
                    </button>
                </div>
                <div className="result-control-buttons">
                    <button className="result-control-button" onClick = {this.handleResultCompare} >
                        Сравнить с предыдущим результатом
                    </button>
                    <button className="result-control-button" onClick = {this.handleRestart} >
                        Попробовать еще раз
                    </button>
                </div>
            </div>
        )
    }

    //Управляемый инпут для имени (при вводе сохраняется в state)
    handleNameInput = (e) => {
        this.setState({
            name: e.target.value
        })
    };

    //Определение местоположения при сохранении результата
    handleLocation = () => {
        navigator.geolocation.getCurrentPosition(this.handleSuccessGetPosition, this.handleErrorGetPosition);
    };

    //Добавляем данные геолокации
    handleSuccessGetPosition = (position) => {
        this.geo = [position.coords.latitude, position.coords.longitude];
        this.handleSaveResults();
    };

    //Если ошибка определения местоположения, все равно сохраняем результаты
    handleErrorGetPosition = () => {
        this.handleSaveResults();
    };

    //Сохраняем результаты теста в localStorage по нажатию на соответствующую кнопку
    handleSaveResults = () => {
        this.setState({
            saveResultsPressed: true
        });
        //Сохраняем значение предыдущего результата из localStorage
        this.previousResult = localStorage.savedResult.result;
        //Сохраняем данные по текущему результату в localStorage
        localStorage.savedResult = JSON.stringify({
            name: this.state.name,
            geo: this.geo,
            result: `${this.props.yourResult}%`,
            date: `год - ${new Date().getFullYear()} месяц - ${new Date().getMonth()} день - ${new Date().getDate()} час - ${new Date().getHours()} минута - ${new Date().getMinutes()}`
        })
    };

    //При нажатии кнопки сравнения с предыдущим результатом передаем в родительский AccomplishTestPage
    // предыдущий результат (если существует).
    handleResultCompare = () => {
        //Если кнопку "Сохранить результат" не нажимали, то предыдущий результат считываем из localStorage
        if(localStorage.savedResult && !this.state.saveResultsPressed) {
            let previousResult = JSON.parse(localStorage.savedResult).result;
            this.props.onShowPreviousResultsChange(true, previousResult);
            //В противном случае предыдущий результат берем из переменной this.previousResult (сохраняли при нажатии на кнопку)
        } else if(localStorage.savedResult && this.state.saveResultsPressed) {
            let previousResult = this.previousResult;
            this.props.onShowPreviousResultsChange(true, previousResult);
        } else {
            this.props.onShowPreviousResultsChange(true);
        }
    };

    //Перезапуск всего теста
    handleRestart = () => {
        this.props.onRestart(this.props.attempt + 1);
        this.props.onShowPreviousResultsChange(false);
    }
}