import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getMemberPerformance } from "../api/reportApi";
import { showError } from "../components/AppToast";

function MemberPerformanceReport() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {

        try {

            const res = await getMemberPerformance();

            setReports(res.data.data);

        } catch (err) {

            showError(err.response?.data?.message || "Failed to load member performance report");

        } finally {

            setLoading(false);

        }

    };

    const filteredReports = reports.filter((item) => {
        const key = search.toLowerCase();
        return (
            item.memberId?.name?.toLowerCase().includes(key) ||
            item.projectId?.name?.toLowerCase().includes(key) ||
            item.statusTag?.toLowerCase().includes(key)
        );
    });

    return (

        <MainLayout>

            <PageHeader title="Member Performance Report" />

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Search Member, Project or Status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {

                loading ?

                <Loader />

                :

                filteredReports.length === 0 ?

                <EmptyState message={search ? "No matching performance data found" : "No Performance Data"} />

                :

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">

                    <thead className="table-dark">

                        <tr>

                            <th>Member</th>
                            <th>Project</th>
                            <th>Score</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredReports.map((item) => (

                                <tr key={item._id}>

                                    <td>{item.memberId?.name}</td>

                                    <td>{item.projectId?.name}</td>

                                    <td>{item.score}</td>

                                    <td>{item.statusTag}</td>

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

export default MemberPerformanceReport;
