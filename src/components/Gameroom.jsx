'use client'

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import CheckpointTenCelebration from "./Checkpoint";

const socket = io("https://ctf-round.onrender.com", { transports: ["websocket"] });

const GameRoom = () => {
    const { userId, roomId } = useParams();
    const [progress, setProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!userId || !roomId) return;

        const storedProgress = localStorage.getItem("progress");
        setProgress(storedProgress ? Number(storedProgress) : 0);

        const fetchProgress = async () => {
            try {
                const response = await fetch(`https://ctf-round.onrender.com/player/progress/${userId}`);
                const data = await response.json();
                setProgress(data.progress);
                localStorage.setItem("progress", data.progress);
            } catch (error) {
                console.error("Error fetching progress:", error);
                toast.error("Error", {
                    description: "Failed to fetch progress. Please try again.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
        socket.emit("joinRoom", roomId);

        return () => {
            socket.off("progressUpdate");
        };
    }, [userId, roomId]);

    const handleCheckpoint = async () => {
        if (progress !== null && progress < 10) {
            setIsUpdating(true);
            const newProgress = progress + 1;
            try {
                await fetch("https://ctf-round.onrender.com/update-progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, checkpoint: newProgress }),
                });

                setProgress(newProgress);
                localStorage.setItem("progress", newProgress);
                socket.emit("progressUpdate", { userId, checkpoint: newProgress });

                toast.success("Progress Updated", {
                    description: `You've reached checkpoint ${newProgress}/10!`,
                });
            } catch (error) {
                toast.error("Error", {
                    description: "Failed to update progress. Please try again.",
                });
            } finally {
                setIsUpdating(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (progress === 10) {
        return (
            <CheckpointTenCelebration />
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Game Room</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold">Checkpoint: {progress}/10</p>
                        <Progress value={progress * 10} className="w-full mt-2" />
                    </div>
                    <Button
                        onClick={handleCheckpoint}
                        disabled={progress >= 10 || isUpdating}
                        className="w-full"
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Next Checkpoint"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default GameRoom;