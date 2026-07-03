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

            <PageHeader
                title="Closure Snapshots"
            />

            {
                loading ?

                <Loader/>

                :

                snapshots.length===0 ?

                <EmptyState
                    message="No Closure Snapshots"
                />

                :

                <table className="table table-bordered">

                    <thead className="table-dark">

                        <tr>

                            <th>Project</th>
                            <th>Budget</th>
                            <th>Estimated</th>
                            <th>Used</th>
                            <th>Completed</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            snapshots.map(item=>(

                                <tr key={item._id}>

                                    <td>{item.projectId?.name}</td>

                                    <td>₹ {item.totalBudget}</td>

                                    <td>{item.estimatedHours}</td>

                                    <td>{item.usedHours}</td>

                                    <td>{item.completedTasks}/{item.totalTasks}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            }

        </MainLayout>

    );

}

export default ClosureSnapshots;