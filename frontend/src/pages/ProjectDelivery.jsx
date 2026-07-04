import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getProjectDeliveries } from "../api/projectDeliveryApi";

function ProjectDelivery() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDeliveries();
    }, []);

    const loadDeliveries = async () => {
        try {
            const res = await getProjectDeliveries();
            setDeliveries(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader title="Project Delivery" />

            {loading ? (
                <Loader />
            ) : deliveries.length === 0 ? (
                <EmptyState message="No Deliveries Found" />
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
                            {deliveries.map(item => (
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