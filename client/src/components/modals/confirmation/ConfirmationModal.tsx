import cs from "./ConfirmationModal.module.css"
import { BaseModal } from "../base_modal/BaseModal"

/**
 * Simple modal for yes/no question decisions
 * Provide title and body text of the modal, which should prompt the user to decide.
 * User can confirm or dismiss using respective buttons or dismiss the modal by clicking the background
 */
export type ConfirmationModalProps = {
    isShown: boolean
    title: string
    body: string
    onConfirm: () => void
    onDismiss: () => void
    onConfirmText?: string
    onDismissText?: string
}

export const ConfirmationModal = ({ isShown, title, body, onConfirm, onDismiss, onConfirmText="Yes", onDismissText="No" }: ConfirmationModalProps) => {

    return (
        <BaseModal isShown={isShown} onDismiss={onDismiss} dependencies={[]}>
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
        </BaseModal>
    )
}