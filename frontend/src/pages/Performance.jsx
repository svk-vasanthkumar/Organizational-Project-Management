import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import PerformanceChart from "../components/PerformanceChart";
import { getPerformance } from "../api/performanceApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Performance() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPerformance();
    }, []);

    const loadPerformance = async () => {
        try {
            const res = await getPerformance();
            setRecords(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Performance Report", 14, 20);

        autoTable(doc, {
            startY: 30,
            head: [["Member", "Project", "Score", "Status"]],
            body: records.map(record => [
                record.memberId?.name,
                record.projectId?.name,
                record.score,
                record.statusTag
            ])
        });

        doc.save("Performance_Report.pdf");
    };

    const exportCSV = () => {
        const headers = ["Member", "Project", "Score", "Status"];

        const rows = records.map(record => [
            record.memberId?.name,
            record.projectId?.name,
            record.score,
            record.statusTag
        ]);

        const csv = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Performance_Report.csv";
        link.click();
    };

    const badge = (tag) => {
        switch (tag) {
            case "Exceeding":
                return "success";
            case "On Track":
                return "primary";
            case "Lagging":
                return "warning";
            case "Critical":
                return "danger";
            default:
                return "secondary";
        }
    };

    return (
        <MainLayout>
            <PageHeader title="Performance Tracker" />

            <div className="mb-3">
                <button className="btn btn-danger" onClick={exportPDF}>
                    Export PDF
                </button>
                <button className="btn btn-success ms-2" onClick={exportCSV}>
                    Export CSV
                </button>
            </div>

            {loading ? (
                <Loader />
            ) : records.length === 0 ? (
                <EmptyState message="No Performance Data" />
            ) : (
                <>
                    <PerformanceChart data={records} />
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Member</th>
                                <th>Project</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Computed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record._id}>
                                    <td>{record.memberId?.name}</td>
                                    <td>{record.projectId?.name}</td>
                                    <td>{record.score}</td>
                                    <td>
                                        <span className={`badge bg-${badge(record.statusTag)}`}>
                                            {record.statusTag}
                                        </span>
                                    </td>
                                    <td>{record.computedAt?.substring(0, 10)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </MainLayout>
    );
}

export default Performance;