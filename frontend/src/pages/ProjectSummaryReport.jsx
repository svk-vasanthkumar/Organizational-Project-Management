import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getProjectSummary } from "../api/reportApi";

function ProjectSummaryReport() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {

        try {

            const res = await getProjectSummary();

            setReports(res.data.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    return (

        <MainLayout>

            <PageHeader title="Project Summary Report" />

            {

                loading ?

                <Loader />

                :

                reports.length === 0 ?

                <EmptyState message="No Report Data" />

                :

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

                            reports.map((item, index) => (

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

            }

        </MainLayout>

    );

}

export default ProjectSummaryReport;