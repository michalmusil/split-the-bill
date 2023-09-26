import cs from "./BaseModal.module.css"
import { ReactNode } from "react"
import { useDisableScroll } from "../../../hooks"



export interface BaseModalProps {
    isShown: boolean
    onDismiss: () => void
    dependencies?: any[],
    children: ReactNode
}

export const BaseModal = ({ isShown, onDismiss, dependencies = [], children }: BaseModalProps) => {
    useDisableScroll(isShown, dependencies)

    return (
        <>
            {
                isShown ?
                    <div className={cs.modal}>
                        <div className={cs.modalOverlay} onClick={(e) => { onDismiss() }} />
                        <div className={cs.modalContent}>
                            { children }
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    )
}