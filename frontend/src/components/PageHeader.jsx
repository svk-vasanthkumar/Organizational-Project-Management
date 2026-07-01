function PageHeader({ title, buttonText, onClick }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">

      <h2>{title}</h2>

      <button
        className="btn btn-primary"
        onClick={onClick}
      >
        {buttonText}
      </button>

    </div>
  );
}

export default PageHeader;