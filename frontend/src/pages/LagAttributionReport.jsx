import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getLagAttribution } from "../api/reportApi";
import { showError } from "../components/AppToast";

function LagAttributionReport() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {

        try {

            const res = await getLagAttribution();

            setReports(res.data.data);

        } catch (err) {

            showError(err.response?.data?.message || "Failed to load lag attribution report");

        } finally {

            setLoading(false);

        }

    };

    const filteredReports = reports.filter((item) => {
        const key = search.toLowerCase();
        return (
            item.taskId?.title?.toLowerCase().includes(key) ||
            item.memberId?.name?.toLowerCase().includes(key) ||
            item.reason?.toLowerCase().includes(key)
        );
    });

    return (

        <MainLayout>

            <PageHeader title="Lag Attribution Report" />

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Search Task, Member or Reason..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {

                loading ?

                <Loader />

                :

                filteredReports.length === 0 ?

                <EmptyState message={search ? "No matching lag records found" : "No Lag Records"} />

                :

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">

                    <thead className="table-dark">

                        <tr>

                            <th>Task</th>
                            <th>Member</th>
                            <th>Original Deadline</th>
                            <th>Revised Deadline</th>
                            <th>Reason</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredReports.map((item) => (

                                <tr key={item._id}>

                                    <td>{item.taskId?.title}</td>

                                    <td>{item.memberId?.name}</td>

                                    <td>{item.originalDeadline?.substring(0,10)}</td>

                                    <td>{item.revisedDeadline?.substring(0,10)}</td>

                                    <td>{item.reason}</td>

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

export default LagAttributionReport;
