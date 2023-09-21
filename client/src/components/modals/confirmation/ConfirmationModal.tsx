import cs from "./ConfirmationModal.module.css"

/**
 * Simple modal for yes/no question decisions
 * Provide title and body text of the modal, which should prompt the user to decide.
 * User can confirm or dismiss using respective buttons or dismiss the modal by clicking the background
 */
export type ConfirmationModalProps = {
    title: string
    body: string
    onConfirm: () => void
    onDismiss: () => void
    onConfirmText?: string
    onDismissText?: string
}

export const ConfirmationModal = ({ title, body, onConfirm, onDismiss, onConfirmText="Yes", onDismissText="No" }: ConfirmationModalProps) => {

    return (
        <div className="modal">
            <div className="modalOverlay" onClick={(e) => { onDismiss() }} />
            <div className="modalContent">
                <h1>{title}</h1>
                <p>{body}</p>
                <div className={cs.horizontalButtonContainer}>
                    <button className={cs.confirmButton} onClick={(e) => { onConfirm() }}>
                        {onConfirmText}
                    </button>
                    <button className={cs.cancelButton} onClick={(e) => { onDismiss() }}>
                        {onDismissText}
                    </button>
                </div>
            </div>
        </div>
    )
}