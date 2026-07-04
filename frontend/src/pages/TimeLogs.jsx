import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getTimeLogs } from "../api/timeLogApi";
import AddTimeLogModal from "../components/AddTimeLogModal";
import { showError } from "../components/AppToast";

function TimeLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const res = await getTimeLogs();
            setLogs(res.data.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load time logs");
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => {
        const key = search.toLowerCase();
        return (
            log.taskId?.title?.toLowerCase().includes(key) ||
            log.memberId?.name?.toLowerCase().includes(key) ||
            log.notes?.toLowerCase().includes(key)
        );
    });

    return (
        <MainLayout>
            <PageHeader
                title="Time Logs"
                buttonText="+ Log Hours"
                onClick={() => setShowModal(true)}
            />

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Search Task, Member or Notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <Loader />
            ) : filteredLogs.length === 0 ? (
                <EmptyState message={search ? "No matching time logs found" : "No Time Logs"} />
            ) : (
                <div className="table-responsive">
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
                            {filteredLogs.map(log => (
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
                </div>
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
