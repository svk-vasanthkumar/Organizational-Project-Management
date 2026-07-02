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

            <PageHeader
                title="Project Delivery"
                buttonText="+ Deliver Project"
            />

            {

                loading ?

                <Loader />

                :

                deliveries.length === 0 ?

                <EmptyState
                    message="No Deliveries Found"
                />

                :

                <table className="table table-bordered table-hover">

                    <thead className="table-dark">

                        <tr>

                            <th>Project</th>
                            <th>Delivery Date</th>
                            <th>Mode</th>
                            <th>Client Signoff</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            deliveries.map(item => (

                                <tr key={item._id}>

                                    <td>{item.projectId?.name}</td>

                                    <td>{item.deliveryDate?.substring(0,10)}</td>

                                    <td>{item.mode}</td>

                                    <td>

                                        {item.clientSignoff ? "✅ Yes" : "❌ No"}

                                    </td>

                                    <td>{item.status}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            }

        </MainLayout>

    );

}

export default ProjectDelivery;