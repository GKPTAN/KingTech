import type React from "react";
import type { JSX } from "react";
import { SiAmd } from "react-icons/si";

interface BrandIcons {
    [key: string]: React.ReactNode;
}

export const brandIcons: BrandIcons = {
    amd: <SiAmd size={60} />
};