/** @format */

import { useAppKitAccount } from "@reown/appkit/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Coins, MapPin } from "lucide-react";

export default function Profile() {
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount();

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>
          Your Web3 account information and rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-gray-500" />
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-medium whitespace-nowrap">
                Wallet Address:
              </span>
              <span className="text-sm text-gray-600 truncate">
                {address ? `${address}` : "Not connected"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-gray-500" />
            <div className="flex items-center gap-2">
              <span className="font-medium">Wallet Status:</span>
              <span className="text-sm text-gray-600">{status}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div className="flex items-center gap-2">
              <span className="font-medium">Location:</span>
              <span className="text-sm text-gray-600">Solana Blockchain</span>
            </div>
          </div>

          <div className="mt-4">
            <Badge variant="secondary" className="text-lg py-1 px-2">
              Reward Points
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
