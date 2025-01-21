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
import { Wallet, Coins, MapPin, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Constants
const PROGRAM_ID = new PublicKey(`${process.env.NEXT_PUBLIC_PROGRAM_ID}`);
const SOLANA_ENDPOINT = "https://api.devnet.solana.com";

type UserStats = {
  points: number;
  authority: PublicKey;
};

const deserializeUserStats = (data: Buffer): UserStats => {
  try {
    // Skip the 8-byte discriminator
    const points = new BN(data.slice(8, 16), "le").toNumber();
    const authority = new PublicKey(data.slice(16, 48));
    return { points, authority };
  } catch (error) {
    console.error("Error deserializing user stats:", error);
    throw error;
  }
};

const Profile = () => {
  const { address, isConnected, status } = useAppKitAccount();
  const [points, setPoints] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const connection = new Connection(SOLANA_ENDPOINT);
        const [userStatsPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("user-stats"), new PublicKey(address).toBuffer()],
          PROGRAM_ID
        );

        const accountInfo = await connection.getAccountInfo(userStatsPDA);

        if (accountInfo?.data) {
          const userStats = deserializeUserStats(accountInfo.data);
          setPoints(userStats.points);
        } else {
          setPoints(0);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setError("Failed to fetch user stats. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [address]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
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
                  {address || "Not connected"}
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
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading points...
                  </div>
                ) : (
                  `Reward Points: ${points ?? 0}`
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
