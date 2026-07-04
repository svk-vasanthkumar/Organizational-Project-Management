import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getProjectDeliveries } from "../api/projectDeliveryApi";
import { showError } from "../components/AppToast";

function ProjectDelivery() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadDeliveries();
    }, []);

    const loadDeliveries = async () => {
        try {
            const res = await getProjectDeliveries();
            setDeliveries(res.data.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load deliveries");
        } finally {
            setLoading(false);
        }
    };

    const filteredDeliveries = deliveries.filter(item => {
        const key = search.toLowerCase();
        return (
            item.projectName?.toLowerCase().includes(key) ||
            item.status?.toLowerCase().includes(key)
        );
    });

    return (
        <MainLayout>
            <PageHeader title="Project Delivery" />

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Search Project or Status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <Loader />
            ) : filteredDeliveries.length === 0 ? (
                <EmptyState message={search ? "No matching deliveries found" : "No Deliveries Found"} />
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Project</th>
                                <th>Completion</th>
                                <th>Tasks</th>
                                <th>Hours</th>
                                <th>Expected End</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map(item => (
                                <tr key={item._id}>
                                    <td>{item.projectName}</td>
                                    <td>
                                        <div className="progress" style={{ height: "8px", minWidth: "120px" }}>
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${item.completion}%` }}
                                            />
                                        </div>
                                        <small>{item.completion}%</small>
                                    </td>
                                    <td>
                                        {item.completedTasks}/{item.totalTasks}
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
                                                item.status === "Completed"
                                                    ? "bg-success"
                                                    : item.status === "Delayed"
                                                    ? "bg-danger"
                                                    : "bg-primary"
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

export default ProjectDelivery;
