import React, { useEffect, useRef, useState } from 'react'

const WORKTIME = 1500;
const SHORTRESTTIME = 300;
const LONGBREAKTIME = 1200;
const LONGBREAKCYCLE = 4;

const ucfirst = (([char, ...rest]) => {
    return [char.toUpperCase(), ...rest].join('');
});

const PomodoroView = ({position, prettyTimer, cycle, onPlay, onNext, onView}) => {
    return (
        <>
            <h3>{ucfirst(cycle)}</h3>
            <button className="timer-view" onClick={onView}><i className="fas fa-cog"></i></button>
            <p className="timer-round">{position + 1}/{LONGBREAKCYCLE}</p>
            <div className="timer">
                <span className="timer-text">{prettyTimer}</span>
            </div>
            <div className="timer-controls">
                <button onClick={onPlay} className="timer-pause">Start</button>
                <button className="timer-next" onClick={onNext}>
                    Next: {cycle === 'work' ? 'Break' : 'Work'} 
                </button>
            </div>
        </>
    );
}

const ConfigurationView = ({onAutomaticBreak, automaticBreak, onView}) => {
    return (
        <>
            <h3>Configuration</h3>
            <button className="timer-view" onClick={onView}><i className="fas fa-times"></i></button>
            <div className="timer-form">
                <div className="timer-row">
                    <label htmlFor="automatic-breaks">Automatic Breaks?</label>
                    <input type="checkbox" id="automatic-breaks" 
                        onChange={onAutomaticBreak} value={automaticBreak}/>
                </div>
            </div>
        </>
    );
}

const PomodoroTimer = () => {
    const [ time, setTime ] = useState(WORKTIME);
    const [ cycle, setCycle ] = useState('work');
    const [ position, setPosition ] = useState(0);
    const [ view, setView ] = useState(0);
    const [ automaticBreak, setAutomaticBreak ] = useState(false);
    const timer = useRef(null);

    const setBreak = () => {
        if (position === (LONGBREAKCYCLE - 1)) {
            setCycle('long break');
            
            return LONGBREAKTIME
        }
        
        setCycle('short break');
        return SHORTRESTTIME;
    }

    const setWork = () => {
        setCycle('work');
        setPosition(prevPosition => 
            prevPosition === 3 ? 0 : prevPosition + 1);

        return WORKTIME;
    }

    const updateTimer = prevTime => {
        if (prevTime < 1) {
            timer.current = clearInterval(timer.current);

            if (cycle === 'work') {
                return setBreak();
            } else {
                return setWork();
            }
        }

        return prevTime - 1;
    }

    const handlePlayTimer = () => {
        if (timer.current) {
            timer.current = clearInterval(timer.current);
            return;
        }

        timer.current = setInterval(
            () => {
                setTime(updateTimer)
            },
            1000
        );
    }

    const handleNext = () => {
        if (cycle === 'work') {
            if (position === (LONGBREAKCYCLE - 1)) {
                setCycle('long break');
                setTime(LONGBREAKTIME);
            } else {
                setCycle('short break');
                setTime(SHORTRESTTIME)
            }
        } else {
            setCycle('work');
            setTime(WORKTIME);
            setPosition(prevPosition => prevPosition === 3 ? 0 : prevPosition + 1);
        }
    }

    const handleAutomaticBreak = () => setAutomaticBreak(!automaticBreak);
    const handleConfigurationView = () => setView(1);
    const handlePomodoroView = () => setView(0);
    
    const minutes = Math.trunc(time / 60);
    const seconds = time - (minutes * 60);
    const prettyTimer = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);

    useEffect(() => {
        document.title = `${prettyTimer} Pomodoro Timer React.js`
    }, [prettyTimer]);

    return (
        <div className="pomodoro-timer">
            {
                view === 0 ? 
                <PomodoroView 
                    cycle={cycle} 
                    prettyTimer={prettyTimer}
                    position={position}
                    onPlay={handlePlayTimer}
                    onNext={handleNext}
                    onView={handleConfigurationView}
                /> :
                <ConfigurationView 
                    automaticBreak={automaticBreak} 
                    onAutomaticBreak={handleAutomaticBreak} 
                    onView={handlePomodoroView}
                />
            }
        </div>
    );
}

export default PomodoroTimer;