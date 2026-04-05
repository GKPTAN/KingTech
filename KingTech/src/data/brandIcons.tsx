import { SiAmd } from "react-icons/si";

import type React from "react";

interface BrandIcons {
    [key: string]: React.ReactNode;
}

export const brandIcons: BrandIcons = {
    amd: <SiAmd size={60} />
};