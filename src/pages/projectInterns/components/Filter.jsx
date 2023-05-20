import React from 'react';
import classes from "../css/Fillter.module.css"

function Filter({roles, selectRole, removeRole, teamName, setTeamName, findTeam}) {
    return (
        <div className={classes["form"]} action="">
            <span  className={classes["span-role"]}  >роль</span>
            <hr className={classes["hr"]}/>

            {roles.map(role =>
            <label className={classes["form-control"]}>
              <input type="checkbox" className={classes["inp"]}
                onChange={(e)=>{
                    if(e.target.checked){
                        selectRole(role.id);
                    }else{
                        removeRole(role.id);
                    }
                } 
                }  />
              {role.title}
            </label> 
            )}
            <span className={classes["span-team"]} >команда</span>
          <hr className={classes["hr"]}/>
            <input type="text" className={classes["text_inp"]} value={teamName} onChange={(e) =>setTeamName(e.target.value)}/>
            <img src={require("../../../images/find.svg").default} onClick={findTeam} height="18.35px"  alt='123'/>
          </div>
    );
}

export default Filter;