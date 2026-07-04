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

    const getDaysOverdue = (deadline) => {
        const today = new Date();
        const due = new Date(deadline);

        const diff = today - due;

        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    };

    return (
        <MainLayout>
            <PageHeader title="Breach Logs" />

            {loading ? (
                <Loader/>
            ) : logs.length === 0 ? (
                <EmptyState message="No Breach Logs"/>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Task</th>
                                <th>Member</th>
                                <th>Original Deadline</th>
                                <th>Days Overdue</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log._id}>
                                    <td>{log.taskId?.title}</td>
                                    <td>{log.memberId?.name}</td>
                                    <td>{log.originalDeadline?.substring(0, 10)}</td>
                                    <td>
                                        <span className="badge bg-danger">
                                            {getDaysOverdue(log.originalDeadline)} Days
                                        </span>
                                    </td>
                                    <td>{log.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    );
}

export default BreachLogs;