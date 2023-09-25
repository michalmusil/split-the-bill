import React, { useEffect } from "react"

export default function useOnClickOutside(ref: React.MutableRefObject<any>, onClickedOutside: () => void, dependencies?: any[]) {
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const outside = ref.current && !ref.current.contains(e.target)
            if(outside){
                onClickedOutside()
            }
        }
        document.addEventListener('mousedown', handler)

        return () => {
            document.removeEventListener('mousedown', handler)
        }

    }, [ref, ...dependencies ?? []])
}