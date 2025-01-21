import {
    createAppKit,
    useAppKit,
    useAppKitProvider,
    useAppKitAccount
} from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { useAppKitConnection, type Provider } from '@reown/appkit-adapter-solana/react'
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { useWalletInfo } from '@reown/appkit/react'

export const projectId = `${process.env.NEXT_PUBLIC_PROJECT_ID}` // this is a public projectId only to use on localhost
// Setup solana adapter
const solanaAdapter = new SolanaAdapter({
    wallets: [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter()]
})

// Create modal
const modal = createAppKit({
    adapters: [solanaAdapter],
    networks: [solana, solanaTestnet, solanaDevnet],
    metadata: {
        name: 'AppKit React Example',
        description: 'AppKit React Solana Example',
        url: 'https://reown.com/appkit',
        icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4']
    },
    projectId,
    themeMode: 'dark',
    features: {
        analytics: true
    }
})

export {
    modal,
    useAppKit,
    useWalletInfo,
}