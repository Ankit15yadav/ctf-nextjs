'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";

const socket = io("https://ctf-round.onrender.com", { transports: ["websocket"] });

const AdminDashboard = () => {
    const { roomID } = useParams();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // Fetch initial player data
        const fetchProgress = async () => {
            const response = await fetch(`https://ctf-round.onrender.com/admin/progress/${roomID}`);
            const data = await response.json();
            setPlayers(data);
        };

        fetchProgress();

        // Listen for real-time progress updates
        socket.emit("joinRoom", roomID);

        socket.on("progressUpdate", (data) => {
            console.log("Received progress update:", data);

            setPlayers((prevPlayers) =>
                prevPlayers.map((player) =>
                    player._id === data.userId ? { ...player, progress: data.checkpoint } : player
                )
            );
        });

        return () => {
            socket.off("progressUpdate");
        };
    }, [roomID]);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <ul>
                {players.map((player) => (
                    <li key={player._id}>
                        {player.username}: {player.progress}/10
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
