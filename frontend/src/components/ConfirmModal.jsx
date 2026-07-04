import { Modal, Button } from "react-bootstrap";

function ConfirmModal({
    show,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "danger",
    onConfirm,
    onClose,
}) {
    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <p className="mb-0">
                    {message}
                </p>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    {cancelText}
                </Button>

                <Button
                    variant={confirmVariant}
                    onClick={onConfirm}
                >
                    {confirmText}
                </Button>

            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;