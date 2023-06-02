import '@rainbow-me/rainbowkit/styles.css';
import "@/styles/globals.css"
import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura'

import dynamic from 'next/dynamic';
import { AppProvider } from '@/components/Global-States';

const { chains, publicClient } = configureChains(
  [
    sepolia
  ],
  [
    publicProvider(),
    infuraProvider({ apiKey: 'some_key' }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});


export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}


function RootLayout({ Component, pageProps }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "bg-background min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WagmiConfig config={wagmiConfig}>
              <RainbowKitProvider chains={chains}>
                <AppProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <SiteHeader />
                    <div className="flex-1"><Component {...pageProps} /></div>
                    <Toaster />
                  </div>
                </AppProvider>
              </RainbowKitProvider>
            </WagmiConfig>
            <TailwindIndicator />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}

export default dynamic(() => Promise.resolve(RootLayout), { ssr: false });
