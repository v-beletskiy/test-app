import React, {Component} from 'react';
import './ProgressBar.css'
import PropTypes from 'prop-types'
//import { CSSTransitionGroup } from 'react-transition-group'

export default class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.fps = 50;
        this.animationTime = 2000;
    }

    static propTypes = {
        amountOfQuestions: PropTypes.number,
        isConfirmed: PropTypes.array
    };

    render() {
        return (
            <div className = "progress-bar">
                <progress value={this.countAccomplishedPercentage()} max={this.props.amountOfQuestions} id="progress-bar">
                </progress>
            </div>
        )
    }

    /*componentDidUpdate(prevProps) {
        if(prevProps.isConfirmed !== this.props.isConfirmed) {
            this.setTimer();
        }
    }*/

    setTimer() {
        let start = Date.now();
        //this.animate();
        this.startTimerID = setInterval( () => {
            let timePassed = Date.now() - start;
            //console.log(timePassed)
            if (timePassed <= this.animationTime) {
                //this.animate(timePassed);
            } else {
                this.clearTimer(); // конец через 2 секунды
            }
        }, this.animationTime / this.fps);
    }

    clearTimer = () => {
        clearInterval(this.startTimerID);
    };

    animate = (timePassed) => {
        let progressValue = document.querySelector('#progress-bar').getAttribute('value');
        //console.log(progressValue);
        let increaseProgressValue = 1 / this.fps;
        //console.log(increaseProgressValue)
        let progressValueUpdated = +progressValue + increaseProgressValue;
        //console.log(progressValueUpdated);
        document.querySelector('#progress-bar').setAttribute('value', progressValueUpdated);
        //console.log(document.querySelector('#progress-bar').getAttribute('value'))
    };

    //Считаем кол-во отвеченных вопросов, выбирая те, которые true в массиве isConfirmed
    countAccomplishedPercentage = () => {
        let accomplished = 0;
        this.props.isConfirmed.forEach(
            function getAccomplishedNumber(value) {
                if(value === true) {
                    accomplished++;
                }
            }
        );
        if(accomplished) {
            this.setTimer();
        }
    return accomplished;
    };
}