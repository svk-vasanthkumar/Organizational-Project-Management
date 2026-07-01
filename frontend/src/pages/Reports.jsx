import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";

function Reports() {

    return (

        <MainLayout>

            <PageHeader
                title="Reports & Analytics"
            />

            <div className="row">

                <div className="col-md-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h5>Project Summary</h5>

                            <button className="btn btn-primary mt-3">

                                View Report

                            </button>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h5>Member Performance</h5>

                            <button className="btn btn-success mt-3">

                                View Report

                            </button>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h5>Lag Attribution</h5>

                            <button className="btn btn-danger mt-3">

                                View Report

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </MainLayout>

    );

}

export default Reports;