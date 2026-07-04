import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";

function Reports() {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <PageHeader title="Reports & Analytics" />

            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-body d-flex flex-column">
                            <h5>Project Summary</h5>
                            <p className="text-muted small">
                                Budget, hours, tasks and completion report.
                            </p>
                            <button 
                                className="btn btn-primary mt-auto w-100"
                                onClick={() => navigate("/reports/project-summary")}
                            >
                                View Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-body d-flex flex-column">
                            <h5>Member Performance</h5>
                            <p className="text-muted small">
                                Productivity, score and resource utilization.
                            </p>
                            <button 
                                className="btn btn-success mt-auto w-100"
                                onClick={() => navigate("/reports/member-performance")}
                            >
                                View Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-body d-flex flex-column">
                            <h5>Lag Attribution</h5>
                            <p className="text-muted small">
                                Delays, overdue tasks and breach analysis.
                            </p>
                            <button 
                                className="btn btn-danger mt-auto w-100"
                                onClick={() => navigate("/reports/lag-attribution")}
                            >
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