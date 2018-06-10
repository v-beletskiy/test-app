import React, {Component} from 'react';
import './Question.css'
import PropTypes from 'prop-types'
//Импортируем изображения к вопросам
import images from '../ImagesImport/ImagesImport.js'

export default class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        };
    }

    static propTypes = {
        question: PropTypes.string,
        questionNumber: PropTypes.number
    };

    render() {
        return (
            <div className="question">
                {this.getQuestion()}
                {this.getQuestionImage()}
            </div>
        );
    }

    //Вывод вопроса
    getQuestion = () => {
        return (
            <p className="question-text">{this.props.question}</p>
        )
    };

    //Вывод изображения, соответствующего вопросу
    getQuestionImage = () => {
        //Формируем ключ объекта изображений, по которому будем обращаться к изображению, соответствующему вопросу
        let imageSrc = `img${this.props.questionNumber + 1}`;
        return (
            <img src={images[imageSrc]} className="question-image" alt=""></img>
        )
    };
}