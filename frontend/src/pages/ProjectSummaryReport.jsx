import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getProjectSummary } from "../api/reportApi";
import { showError } from "../components/AppToast";

function ProjectSummaryReport() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {

        try {

            const res = await getProjectSummary();

            setReports(res.data.data);

        } catch (err) {

            showError(err.response?.data?.message || "Failed to load project summary report");

        } finally {

            setLoading(false);

        }

    };

    const filteredReports = reports.filter((item) =>
        item.project?.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <MainLayout>

            <PageHeader title="Project Summary Report" />

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Search Project..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {

                loading ?

                <Loader />

                :

                filteredReports.length === 0 ?

                <EmptyState message={search ? "No matching report data found" : "No Report Data"} />

                :

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">

                    <thead className="table-dark">

                        <tr>

                            <th>Project</th>

                            <th>Budget</th>

                            <th>Estimated Hours</th>

                            <th>Allocated Hours</th>

                            <th>Used Hours</th>

                            <th>Completed Tasks</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredReports.map((item, index) => (

                                <tr key={index}>

                                    <td>{item.project}</td>

                                    <td>₹ {item.budget}</td>

                                    <td>{item.estimatedHours}</td>

                                    <td>{item.allocatedHours}</td>

                                    <td>{item.usedHours}</td>

                                    <td>

                                        {item.completedTasks} / {item.totalTasks}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                    </table>

                </div>

            }

        </MainLayout>

    );

}

export default ProjectSummaryReport;
