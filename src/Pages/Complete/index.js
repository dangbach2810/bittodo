import React, { useEffect, useState } from "react";
import "./styles.scss"
import { apiClient } from "../../Services";
const Complete = (props) => {
    const [tasks, setTasks] = useState([])
    const { idTarget } = props
    useEffect(() => {
        if (idTarget != null) {
            apiClient.fetApiProject(idTarget).then(res => {
                setTasks(res.data)
            })
        }
    }, [])
    return (<>
        {tasks}
    </>
    )
};
export default Complete;