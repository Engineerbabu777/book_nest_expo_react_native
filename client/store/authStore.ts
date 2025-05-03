
import { create } from "zustand";

export const useAuthStore = create((set) = ({
    user:{name:"john"},

    sayeHello : () => console.log("Sayeing hello")
}))