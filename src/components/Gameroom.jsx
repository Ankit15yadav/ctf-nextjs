'use client'

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";

const socket = io("https://ctf-round.onrender.com", { transports: ["websocket"] });

const GameRoom = () => {
    const { userId, roomId } = useParams();

    // Start with null to avoid hydration mismatch
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        if (!userId || !roomId) return;

        // Fetch progress from localStorage safely after mount
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
            const newProgress = progress + 1;
            setProgress(newProgress);
            localStorage.setItem("progress", newProgress);

            await fetch("https://ctf-round.onrender.com/update-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, checkpoint: newProgress }),
            });

            socket.emit("progressUpdate", { userId, checkpoint: newProgress });
        }
    };

    if (progress === null) {
        return <p>Loading...</p>; // Prevents rendering before hydration completes
    }

    return (
        <div>
            <h2>Game Room</h2>
            <p>Checkpoint: {progress}/10</p>
            <button onClick={handleCheckpoint} disabled={progress >= 10}>Next Checkpoint</button>
        </div>
    );
};

export default GameRoom;
