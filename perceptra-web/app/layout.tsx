import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Perceptra | Monitoring workspace',description:'Local single-camera monitoring workspace'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
