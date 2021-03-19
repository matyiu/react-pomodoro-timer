import React from 'react'

const PomodoroTimer = () => {
    return (
        <div className="pomodoro-timer">
            <h3>Work</h3>
            <p className="timer-round">3/4</p>
            <div className="timer">
                <span className="timer-text">22:09</span>
            </div>
            <div className="timer-controls">
                <button className="timer-pause">Pause</button>
                <button className="timer-next">Break <i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default PomodoroTimer;