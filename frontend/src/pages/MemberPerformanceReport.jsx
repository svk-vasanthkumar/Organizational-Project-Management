import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getMemberPerformance } from "../api/reportApi";

function MemberPerformanceReport() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {

        try {

            const res = await getMemberPerformance();

            setReports(res.data.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    return (

        <MainLayout>

            <PageHeader title="Member Performance Report" />

            {

                loading ?

                <Loader />

                :

                reports.length === 0 ?

                <EmptyState message="No Performance Data" />

                :

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

                            reports.map((item) => (

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

            }

        </MainLayout>

    );

}

export default MemberPerformanceReport;