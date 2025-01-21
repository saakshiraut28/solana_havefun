/** @format */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HandHeart, Loader2 } from "lucide-react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";

type Message = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  authorPublicKey: string;
};

type MessageCardProps = {
  message: Message;
};

type AlertState = {
  show: boolean;
  message: string;
  variant: "default" | "destructive";
};

const MessageCard = ({ message }: MessageCardProps): React.ReactElement => {
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    variant: "default",
  });

  const { address } = useAppKitAccount();
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");

  const showAlert = (
    message: string,
    variant: "default" | "destructive" = "default"
  ) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleLike = async (): Promise<void> => {
    if (!address || !walletProvider) {
      showAlert("Please connect your wallet to like messages", "destructive");
      return;
    }

    try {
      setIsLiking(true);

      const PROGRAM_ID = new PublicKey(`${process.env.NEXT_PUBLIC_PROGRAM_ID}`);

      const creatorPubkey = new PublicKey(message.authorPublicKey);

      const [creatorStatsKey] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), creatorPubkey.toBuffer()],
        PROGRAM_ID
      );

      if (!walletProvider.publicKey) {
        console.log("Problem with walletProvider.Publickey");
        return;
      }

      const likeIx = new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [
          {
            pubkey: walletProvider.publicKey,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: creatorPubkey,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: creatorStatsKey,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        data: Buffer.from([
          0, // Instruction index for like_message
          ...new TextEncoder().encode(message.id), // Encode message_id as bytes
        ]),
      });

      if (!connection) {
        return;
      }

      const tx = new Transaction().add(likeIx);
      tx.feePayer = walletProvider.publicKey;
      tx.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;

      await walletProvider.signAndSendTransaction(tx);
      showAlert(
        "Successfully liked the message! 0.5 SOL has been transferred to the creator"
      );
    } catch (error) {
      showAlert(
        error instanceof Error
          ? error.message
          : "An error occurred while liking the message",
        "destructive"
      );
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="space-y-4">
      {alert.show && (
        <Alert variant={alert.variant}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HandHeart className="h-5 w-5" />
              {message.author}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {message.timestamp}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message.content}</p>
          <Button
            onClick={handleLike}
            disabled={isLiking || !address}
            className="w-full"
            variant="outline"
            size="sm"
          >
            {isLiking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Liking...
              </>
            ) : (
              <>
                <HandHeart className="mr-2 h-4 w-4" />
                Like (0.5 SOL)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageCard;
