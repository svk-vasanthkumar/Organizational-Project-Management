import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getClosureSnapshots } from "../api/closureSnapshotApi";

function ClosureSnapshots() {
    const [snapshots, setSnapshots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSnapshots();
    }, []);

    const loadSnapshots = async () => {
        try {
            const res = await getClosureSnapshots();
            setSnapshots(res.data.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader title="Closure Snapshots" />

            {loading ? (
                <Loader/>
            ) : snapshots.length === 0 ? (
                <EmptyState message="No Closure Snapshots" />
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Project</th>
                                <th>Completion</th>
                                <th>Hours</th>
                                <th>Expected End</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {snapshots.map(item => (
                                <tr key={item._id}>
                                    <td>{item.projectName}</td>
                                    <td>
                                        <div
                                            className="progress"
                                            style={{ height: "8px", minWidth: "120px" }}
                                        >
                                            <div
                                                className="progress-bar bg-success"
                                                style={{ width: `${item.completion}%` }}
                                            />
                                        </div>
                                        <small>{item.completion}%</small>
                                    </td>
                                    <td>
                                        {item.usedHours}/{item.allocatedHours}
                                    </td>
                                    <td>
                                        {item.expectedEndDate?.substring(0, 10)}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                item.status === "Closed"
                                                    ? "bg-success"
                                                    : "bg-warning text-dark"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    );
}

export default ClosureSnapshots;