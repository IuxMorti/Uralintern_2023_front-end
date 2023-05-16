import React from 'react';
import classes from "./css/Team.module.css"
import { useGetTeamQuery } from '../../redux/authApi';
import { useParams } from 'react-router-dom';
import TeamCommon from './components/TeamCommon';
import TeamForTutor from './components/TeamForTutor';
import { useSelector } from 'react-redux';


function Team(props) {
    const {teamId} = useParams();
    const team = useGetTeamQuery({id:teamId});
    const {user} = useSelector(state => state.auth);
    if (team.isLoading) return <div></div>;
    console.log(team);

    if (!!user.groups.find(group => group ==="куратор" || group ==="руководитель")
     && !team.data.interns.map(intern => intern.id_intern).find((id) => id === user.user_id)){
        return <TeamForTutor team={team.data}/>
     }

    return (
         <TeamCommon team={team.data}/>
       // <TeamForTutor team={team.data}/>
    );
}

export default Team;