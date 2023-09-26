import { useEffect } from "react";

export default function useDisableScroll(scrollDisabled: boolean, dependencies: any[] = []){
    useEffect(() => {
        if(scrollDisabled){
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [scrollDisabled, ...dependencies])
}