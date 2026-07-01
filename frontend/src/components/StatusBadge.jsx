function StatusBadge({ status }) {

  let color = "secondary";

  if (status === "Active") color = "success";
  else if (status === "Draft") color = "warning";
  else if (status === "Completed") color = "primary";
  else if (status === "Rejected") color = "danger";

  return (
    <span className={`badge bg-${color}`}>
      {status}
    </span>
  );
}

export default StatusBadge;