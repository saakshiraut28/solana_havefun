/** @format */

import { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Coins, MapPin } from "lucide-react";

type UserStats = {
  points: number;
  authority: PublicKey;
};

// Function to deserialize the account data
const deserializeUserStats = (data: Buffer): UserStats => {
  // Skip the 8-byte discriminator
  const points = new BN(data.slice(8, 16), "le").toNumber();
  const authority = new PublicKey(data.slice(16, 48));

  return {
    points,
    authority,
  };
};

export default function Profile() {
  const { address, isConnected, status } = useAppKitAccount();
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (!address) return;

    const connection = new Connection("https://api.devnet.solana.com"); // Use your cluster endpoint
    const programId = new PublicKey(
      "3C98PcyQy1QGfNyYVakfVP4Xeba4fFg5tW7KBADSyjnP"
    );

    const userStatsSeed = [
      Buffer.from("user-stats"),
      new PublicKey(address).toBuffer(),
    ];

    // Fetch UserStats account
    (async () => {
      try {
        const [userStatsPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("user-stats"), new PublicKey(address).toBuffer()],
          programId
        );

        const accountInfo = await connection.getAccountInfo(userStatsPDA);

        if (accountInfo && accountInfo.data) {
          const userStats = deserializeUserStats(accountInfo.data);
          setPoints(userStats.points);
        } else {
          setPoints(0);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    })();
  }, [address]);

  return (
    <>
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
                <span className="font-medium">Chain:</span>
                <span className="text-sm text-gray-600">Solana</span>
              </div>
            </div>

            <div className="mt-4">
              <Badge variant="secondary" className="text-lg py-1 px-2">
                Reward Points: {points !== null ? points : "Loading..."}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
