import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getTimeLogs } from "../api/timeLogApi";
import AddTimeLogModal from "../components/AddTimeLogModal";

function TimeLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const res = await getTimeLogs();
            setLogs(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader
                title="Time Logs"
                buttonText="+ Log Hours"
                onClick={() => setShowModal(true)}
            />

            {loading ? (
                <Loader />
            ) : logs.length === 0 ? (
                <EmptyState message="No Time Logs" />
            ) : (
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Task</th>
                            <th>Member</th>
                            <th>Date</th>
                            <th>Hours</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log._id}>
                                <td>{log.taskId?.title}</td>
                                <td>{log.memberId?.name}</td>
                                <td>{log.date?.substring(0, 10)}</td>
                                <td>{log.hoursLogged}</td>
                                <td>{log.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <AddTimeLogModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                refreshLogs={loadLogs}
            />
        </MainLayout>
    );
}

export default TimeLogs;