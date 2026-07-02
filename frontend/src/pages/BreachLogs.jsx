import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getBreachLogs } from "../api/breachLogApi";

function BreachLogs() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {

        try {

            const res = await getBreachLogs();

            setLogs(res.data.data);

        } finally {

            setLoading(false);

        }

    };

    return (

        <MainLayout>

            <PageHeader title="Breach Logs" />

            {

                loading ?

                <Loader/>

                :

                logs.length===0 ?

                <EmptyState message="No Breach Logs"/>

                :

                <table className="table table-bordered">

                    <thead className="table-dark">

                        <tr>

                            <th>Task</th>

                            <th>Member</th>

                            <th>Original</th>

                            <th>Revised</th>

                            <th>Reason</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            logs.map(log=>(

                                <tr key={log._id}>

                                    <td>{log.taskId?.title}</td>

                                    <td>{log.memberId?.name}</td>

                                    <td>{log.originalDeadline?.substring(0,10)}</td>

                                    <td>{log.revisedDeadline?.substring(0,10)}</td>

                                    <td>{log.reason}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            }

        </MainLayout>

    );

}

export default BreachLogs;