import React, { useRef, useState } from 'react'

const WORKTIME = 1500;

const PomodoroTimer = () => {
    const [time, setTime] = useState(WORKTIME);
    const timer = useRef(null);

    const handlePlayTimer = () => {
        if (timer.current) {
            timer.current = clearInterval(timer.current);
            return;
        }

        timer.current = setInterval(
            () => {
                setTime(prevTime => {
                    if (prevTime < 1) {
                        timer.current = clearInterval(timer.current);

                        return WORKTIME;
                    }

                    return prevTime - 1;
                })
            },
            1000
        );
    }

    const minutes = Math.trunc(time / 60);
    const seconds = time - (minutes * 60);

    return (
        <div className="pomodoro-timer">
            <h3>Work</h3>
            <p className="timer-round">3/4</p>
            <div className="timer">
                <span className="timer-text">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
            </div>
            <div className="timer-controls">
                <button onClick={handlePlayTimer} className="timer-pause">Start</button>
                <button className="timer-next">Break <i class="fas fa-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default PomodoroTimer;