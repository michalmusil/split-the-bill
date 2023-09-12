import cs from "./ConfirmationModal.module.css"

const ConfirmationModal = ({ title, body, onConfirm, onDismiss, confirmText="Yes", cancelText="No" }) => {

    return (
        <div className="modal">
            <div className="modalOverlay" onClick={(e) => { onDismiss() }} />
            <div className="modalContent">
                <h1>{title}</h1>
                <p>{body}</p>
                <div className={cs.horizontalButtonContainer}>
                    <button className={cs.confirmButton} onClick={(e) => { onConfirm() }}>
                        {confirmText}
                    </button>
                    <button className={cs.cancelButton} onClick={(e) => { onDismiss() }}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal