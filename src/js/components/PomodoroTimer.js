import React, { useEffect, useRef, useState } from 'react'
import useForm from '../hooks/useForm';
import Toggle from './Toggle';

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

const ConfigurationView = ({configuration, onChangeForm, onView}) => {
    const { 
        automaticBreak, 
    } = configuration;

    const workTime = configuration.workTime / 60;
    const shortBreakTime = configuration.shortBreakTime / 60;
    const longBreakTime = configuration.longBreakTime / 60;

    const handleTimeChange = evt => {
        const value = evt.target.value * 60;
        const name = evt.target.name;

        onChangeForm({target: {
            value,
            name
        }});
    }

    return (
        <>
            <h3>Configuration</h3>
            <button className="timer-view" onClick={onView}><i className="fas fa-times"></i></button>
            <div className="timer-form">
                <div className="timer-row">
                    <label htmlFor="automatic-breaks">Automatic Breaks?</label>
                    <Toggle onChange={onChangeForm} value={automaticBreak} 
                        name="automaticBreak" id="automatic-breaks" />
                </div>
                <div className="timer-row">
                    <label htmlFor="work-time">Work Time:</label>
                    <input type="number" id="work-time" min="0" value={workTime}
                        max="120" name="workTime" onChange={handleTimeChange} />
                </div>
                <div className="timer-row">
                    <label htmlFor="short-break-time">Short Break Time:</label>
                    <input type="number" id="short-break-time" min="0" value={shortBreakTime}
                        max="30" name="shortBreakTime" onChange={handleTimeChange} />
                </div>
                <div className="timer-row">
                    <label htmlFor="long-break-time">Long Break Time:</label>
                    <input type="number" id="long-break-time" min="0" value={longBreakTime}
                        max="60" name="longBreakTime" onChange={handleTimeChange} />
                </div>
            </div>
        </>
    );
}

const PomodoroTimer = () => {
    const [ cycle, setCycle ] = useState('work');
    const [ position, setPosition ] = useState(0);
    const [ view, setView ] = useState(0);
    const [ configuration, setConfiguration ] = useForm({
        automaticBreak: false,
        workTime: 1500,
        shortBreakTime: 300,
        longBreakTime: 1200
    });
    const [ time, setTime ] = useState(configuration.workTime);
    const [ timerState, setTimerState ] = useState('stopped');
    const timer = useRef(null);
    const breakAudio = useRef(null);
    const workAudio = useRef(null);

    const setBreak = () => {
        if (position === (LONGBREAKCYCLE - 1)) {
            setCycle('long break');
            
            return configuration.longBreakTime
        }
        
        setCycle('short break');
        return configuration.shortBreakTime;
    }

    const setWork = () => {
        setCycle('work');
        setPosition(prevPosition => 
            prevPosition === 3 ? 0 : prevPosition + 1);

        return configuration.workTime;
    }

    const running = () => {
        setTime(prevTime => {
            if (prevTime < 1) {
                stop();

                if (cycle === 'work') {
                    setTime(setBreak());
                    if (breakAudio.current.HAVE_ENOUGH_DATA === 4) {
                        breakAudio.current.play();
                    }
                } else {
                    setTime(setWork());
                    if (workAudio.current.HAVE_ENOUGH_DATA === 4) {
                        workAudio.current.play();
                    }
                }
            } else {
                return prevTime - 1;
            }
        });
    }

    const stop = () => {
        timer.current = clearInterval(timer.current);
        setTimerState(!configuration.automaticBreak || cycle !== 'work' ? 'stopped' : 'automatic');
    }

    const play = () => {
        timer.current = setInterval(running, 1000);
        setTimerState(configuration.automaticBreak ? 'automatic' : 'running');
    }

    const handlePlayTimer = () => {
        if (timerState === 'running') {
            stop();
        } else {
            play();
        }
    }

    const handleNext = () => {
        setTime(() => {
            if (cycle === 'work') {
                return setBreak();
            } else {
                return setWork();
            }
        });
    }

    const handleConfigurationView = () => setView(1);
    const handlePomodoroView = () => setView(0);
    
    const minutes = Math.trunc(time / 60);
    const seconds = time - (minutes * 60);
    const prettyTimer = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);

    useEffect(() => {
        document.title = `${prettyTimer} Pomodoro Timer React.js`
    }, [prettyTimer]);

    useEffect(() => {
        if (cycle.match('break') && timerState === 'automatic') {
            play();
        }
    }, [cycle, timerState]);

    useEffect(() => {
        if (timerState === 'stopped') {
            if (cycle === 'work') {
                setTime(configuration.workTime);
            } else if (cycle === 'short break') {
                setTime(configuration.shortBreakTime);
            } else {
                setTime(configuration.longBreakTime);
            }
        }
    }, [configuration]);

    useEffect(() => {
        workAudio.current = new Audio('https://freesound.org/data/previews/377/377639_7003434-lq.mp3');
        breakAudio.current = new Audio('https://freesound.org/data/previews/264/264594_65641-lq.mp3');
    }, []);

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
                    configuration={configuration}
                    onChangeForm={setConfiguration}
                    onView={handlePomodoroView}
                />
            }
        </div>
    );
}

export default PomodoroTimer;