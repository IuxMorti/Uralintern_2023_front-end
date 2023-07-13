import React, {useEffect, useState} from 'react';
import s from './GanttHeader.module.css'
import Select from "../UI/Select";
import Button from "../UI/Button";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {projectInterns, projectsId, projectsList, tasksState, teamsList, userState} from "../../store/atom";
import Modal from "../GanttTaskForm/Modal/Modal";
import { getAllTask, getProjectInterns, getUserInfo} from "../../services/task";

const GanttHeader = () => {
    const [projectId, setProjectId] = useRecoilState(projectsId);
    const [formType, setFormType] = useState('')
    const [showModal, setShowModal] = useState(false)
    const parentId = null
    const projectList = useRecoilValue(projectsList)
    const setTasks = useSetRecoilState(tasksState);

    const openForm = (type) => {
        setFormType(type);
        setShowModal(true);
    };

    const changeId = async (event) => {
        event.preventDefault()
        setProjectId(event.target.value)
    }

    useEffect(() =>{
        if(changeId){
            getAllTask("gantt", projectId)
                .then((response) => {
                    setTasks(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    })

    return (
        <div className={s.container}>
            <div className={s.elements}>
                <div className={s.selects}>
                    <Select
                        options={projectList}
                        onChange={changeId}
                        defaultValue={projectList[0]?.id}
                    />
                </div>
                <div className={s.buttons}>
                    <Button children={"Создать задачу"} onClick={()=>openForm('create')}/>
                </div>
            </div>
            <Modal parentId={parentId} showModal={showModal} setShowModal={setShowModal} formType={formType} setFormType={setFormType}/>
        </div>
    );
};

export default GanttHeader;