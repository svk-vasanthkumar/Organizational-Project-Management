import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { getTasks } from "../api/taskApi";
import { getMembers } from "../api/teamMemberApi";
import { createTimeLog } from "../api/timeLogApi";

function AddTimeLogModal({
    show,
    handleClose,
    refreshLogs
}) {

    const [tasks,setTasks]=useState([]);
    const [members,setMembers]=useState([]);

    const [formData,setFormData]=useState({
        taskId:"",
        memberId:"",
        date:"",
        hoursLogged:"",
        notes:""
    });

    useEffect(()=>{

        loadData();

    },[]);

    const loadData=async()=>{

        const taskRes=await getTasks();
        const memberRes=await getMembers();

        setTasks(taskRes.data.data);
        setMembers(memberRes.data.data);

    }

    const handleChange=(e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    }

    const handleSave=async()=>{

        try{

            await createTimeLog(formData);

            refreshLogs();

            handleClose();

        }catch(err){

            console.log(err);

            alert("Failed");

        }

    }

    return(

<Modal show={show} onHide={handleClose}>

<Modal.Header closeButton>

<Modal.Title>

Log Hours

</Modal.Title>

</Modal.Header>

<Modal.Body>

<Form>

<Form.Group className="mb-3">

<Form.Label>Task</Form.Label>

<Form.Select
name="taskId"
value={formData.taskId}
onChange={handleChange}
>

<option value="">Select</option>

{

tasks.map(task=>(

<option
key={task._id}
value={task._id}
>

{task.title}

</option>

))

}

</Form.Select>

</Form.Group>

<Form.Group className="mb-3">

<Form.Label>Member</Form.Label>

<Form.Select
name="memberId"
value={formData.memberId}
onChange={handleChange}
>

<option value="">Select</option>

{

members.map(member=>(

<option
key={member._id}
value={member._id}
>

{member.name}

</option>

))

}

</Form.Select>

</Form.Group>

<Form.Group className="mb-3">

<Form.Label>Date</Form.Label>

<Form.Control
type="date"
name="date"
value={formData.date}
onChange={handleChange}
/>

</Form.Group>

<Form.Group className="mb-3">

<Form.Label>Hours</Form.Label>

<Form.Control
type="number"
name="hoursLogged"
value={formData.hoursLogged}
onChange={handleChange}
/>

</Form.Group>

<Form.Group>

<Form.Label>Notes</Form.Label>

<Form.Control
as="textarea"
rows={3}
name="notes"
value={formData.notes}
onChange={handleChange}
/>

</Form.Group>

</Form>

</Modal.Body>

<Modal.Footer>

<Button
variant="secondary"
onClick={handleClose}
>

Cancel

</Button>

<Button
variant="primary"
onClick={handleSave}
>

Save Log

</Button>

</Modal.Footer>

</Modal>

    );

}

export default AddTimeLogModal;