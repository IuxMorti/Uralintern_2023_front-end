import React, {useEffect, useState} from 'react';
import classes from '../css/Header.module.css'
import Navigation from './Navigation';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {logOut} from '../redux/authSlice';
import {reset} from '../redux/authApi';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {taskIdState, timerState} from "../store/atom";
import Modal from "./GanttTaskForm/Modal/Modal";
import {ReactComponent as StartTimerButton} from '../assets/img/startTimerButton.svg';
import {ReactComponent as PauseTimerButton} from '../assets/img/pauseTimerButton.svg';
import {ReactComponent as TrashTimerButton} from '../assets/img/trashButton.svg';
import {getIdTask, getUser, refreshAccessToken, timeSpent} from "../services/task";

function Header({modalIsOpen}) {

    const [open, setOpen] = useState(false);
    const {user} = useSelector(state => state.auth);

    const [activeCategory, setActiveCategory] = useState("");
    const [showTaskInfo, setShowTaskInfo] = useState(false);
    const [timer, setTimer] = useRecoilState(timerState);
    const taskId = useRecoilValue(taskIdState)
    const setTaskId = useSetRecoilState(taskIdState)
    const [formType, setFormType] = useState('')
    const [showModal, setShowModal] = useState(false)

    const openForm = (type) => {
        if (user) {
            setFormType(type);
            setShowModal(true);
        }
    };

    // const openForm = async (type) => {
    //     try {
    //         await getUser(user.user_id)
    //         await setFormType(type);
    //         setShowModal(true);
    //     }catch (e) {
    //         console.log(e)
    //     }
    // };
    //
    useEffect(() => {
        const refreshInterval = setInterval(refreshAccessToken, 60 * 1000);
        return () => clearInterval(refreshInterval);
    }, []);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const startTimer = () => {
        if (!timer.isRunning) {
            const timerId = setInterval(() => {
                setTimer((prevTimer) => ({
                    ...prevTimer,
                    time: prevTimer.time + 1,
                }));
            }, 1000);

            setTimer((prevTimer) => ({
                ...prevTimer,
                isRunning: true,
                timerId
            }));
        }
    };

    const stopTimer = () => {
        if (timer.isRunning) {
            clearInterval(timer.timerId);
            setTimer((prevTimer) => ({
                ...prevTimer,
                isRunning: false,
            }));
        }
    };

    const resetTimer = () => {
        if (!timer.isRunning && timer.taskId === taskId.task.id) {
            clearInterval(timer.timerId);
            setTimer((prevTimer) => ({
                ...prevTimer,
                time: taskId.executors.find((executor) => executor.user_id === user.user_id)?.time_spent !== null ?
                    taskId.executors.find((executor) => executor.user_id === user.user_id)?.time_spent
                    : 0,
                isRunning: false,
                timerId: null,
            }));
        }
    };

    const saveTimer = async () => {
            if (!timer.isRunning && timer.taskId === taskId.task.id) {
                clearInterval(timer.timerId);
                setTimer((prevTimer) => ({
                    ...prevTimer,
                    isRunning: false,
                    timerId: null,
                }));

                try {
                    await timeSpent(taskId.task.id, timer.time);
                    const updatedTaskId = await getIdTask(taskId.task.id);
                    setTaskId(updatedTaskId);
                } catch (error) {
                    console.log(error)
                }
            }
    };

    const handleTaskClick = () => {
        setShowTaskInfo(!showTaskInfo);
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        if (category === 'kanban') {
            navigate(`/user/${user.user_id}/kanban`);
        } else if (category === 'gantt') {
            navigate(`/user/${user.user_id}/gantt`);
        } else if (category === 'profile') {
            navigate(`/user/${user.user_id}/user`)
        }
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    if (!user) {
        return (
            <header className={classes["main-header"]}>
                <img className={classes['small-logo']}
                     src={require("../images/logo_small.svg").default}
                     width="48" height="48"
                     alt="Логотип"
                />
            </header>)
    }

    const out = () => {
        dispatch(reset());
        dispatch(logOut());
    }
    return (
        <div>
            <header className={`${classes["main-header"]}`}>
                <div className={classes.left}>
                    <div className={classes.leftIcon}>
                        <img className={classes['nav-icon']}
                             onClick={() => setOpen(!open)}
                             src={require("../assets/img/burger.svg").default}
                             width="24" height="24"
                             alt="Иконка навигации"
                        />

                        <img className={classes['small-logo']}
                             src={require("../images/logo_small.svg").default}
                             width="48" height="48"
                             alt="Логотип"
                        />
                    </div>
                    <div className={classes['navigates']}>
                        <div
                            className={activeCategory === 'profile' ? classes.profileActive : classes.profile}
                            onClick={() => handleCategoryClick('profile')}>
                            <img
                                src={activeCategory === 'profile' ? require("../assets/img/activeUser.svg").default : require("../assets/img/UserHeader.svg").default}
                                width="16" height="16" alt="Мой профиль"
                            />
                            <p>Мой Профиль</p>
                        </div>
                        <div
                            className={activeCategory === 'kanban' ? classes.kanbanActive : classes.kanban}
                            onClick={() => handleCategoryClick('kanban')}>
                            <img
                                onClick={() => setOpen(open)}
                                src={activeCategory === 'kanban' ? require("../assets/img/activeKanban.svg").default : require("../assets/img/KanbanHeader.svg").default}
                                width="16" height="16" alt="Мой профиль"
                            />
                            <p>Канбан</p>
                        </div>
                        <div
                            className={activeCategory === 'gantt' ? classes.ganttActive : classes.gantt}
                            onClick={() => handleCategoryClick('gantt')}>
                            <img
                                src={activeCategory === 'gantt' ? require("../assets/img/activeGantt.svg").default : require("../assets/img/GanttHeader.svg.svg").default}
                                width="16" height="16" alt="Мой профиль"
                            />
                            <p>Гант</p>
                        </div>
                    </div>
                </div>
                <div className={classes['right']}>

                    <div className={classes.timer}>
                        {timer.taskId !== null ?
                            <div className={classes.time}>
                                <span className={classes.buttonInfo}
                                      onClick={handleTaskClick}>
                                    {timer.taskName}
                                </span>
                                {showTaskInfo && (
                                    <div className={classes.taskInfo}>
                                        <div className={classes.taskInfo_left}>
                                            <span>
                                                {timer.taskName}
                                            </span>
                                            {/*<p onClick={() => openForm('view')}>Информация о задаче</p>*/}
                                        </div>
                                        <div className={classes.taskInfo_right}>
                                            <span>
                                                <p>{formatTime(timer.time)}</p>
                                            </span>
                                            <div className={classes.taskInfo_time}>
                                                <span onClick={timer.isRunning ? stopTimer : startTimer}
                                                      className={classes.play}>
                                                    {timer.isRunning ? <PauseTimerButton/> : <StartTimerButton/>}
                                                </span>
                                                <span onClick={saveTimer} className={classes.save}>Сохранить</span>
                                                <span onClick={resetTimer} className={classes.trash}>
                                                   <TrashTimerButton/>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <span>
            <p>{formatTime(timer.time)}</p>
          </span>
                            </div>
                            : null
                        }
                    </div>

                    <img className={classes['settings-icon']}
                         onClick={() => navigate("/change-info")}
                         src={require("../assets/img/settings.svg").default}
                         width="24" height="24"
                         alt="Настройка"
                    />

                    <div className={classes["exit"]} onClick={() => out()}>
                        <img src={require("../assets/img/exit.svg").default} width="24" height="24" alt="Выйти"/>
                        <p>Выйти</p>
                    </div>
                </div>
            </header>
            <Modal id={timer.taskId} showModal={showModal} setShowModal={setShowModal} formType={formType}
                   setFormType={setFormType}/>
            <Navigation open={open} onClose={() => setOpen(false)} modalIsOpen={modalIsOpen}/>
        </div>
    );
}

export default Header;
