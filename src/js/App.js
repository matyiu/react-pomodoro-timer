import React from 'react';
import { hot } from 'react-hot-loader/root';
import PomodoroTimer from './components/PomodoroTimer';

const App = () => {
    return (
        <div className="app">
            <h1>React Pomodoro Timer</h1>
            <PomodoroTimer />
        </div>
    );
}

export default hot(App);