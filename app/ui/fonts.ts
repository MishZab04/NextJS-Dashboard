import { Inter, Lusitana } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  fallback: ["system-ui", "Arial"],
});

export const lusitana = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
  fallback: ["Georgia", "serif"],
});
