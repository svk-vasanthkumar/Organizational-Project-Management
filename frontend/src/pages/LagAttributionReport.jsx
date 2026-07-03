import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getLagAttribution } from "../api/reportApi";

function LagAttributionReport() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {

        try {

            const res = await getLagAttribution();

            setReports(res.data.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    return (

        <MainLayout>

            <PageHeader title="Lag Attribution Report" />

            {

                loading ?

                <Loader />

                :

                reports.length === 0 ?

                <EmptyState message="No Lag Records" />

                :

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

                            reports.map((item) => (

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

            }

        </MainLayout>

    );

}

export default LagAttributionReport;