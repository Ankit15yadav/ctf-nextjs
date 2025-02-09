"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import io from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const socket = io("https://ctf-round.onrender.com", { transports: ["websocket"] })

const AdminDashboard = () => {
    const { roomID } = useParams()
    const [players, setPlayers] = useState([])

    useEffect(() => {
        const fetchProgress = async () => {
            const response = await fetch(`https://ctf-round.onrender.com/admin/progress/${roomID}`)
            const data = await response.json()
            setPlayers(data)
        }

        fetchProgress()

        socket.emit("joinRoom", roomID)

        socket.on("progressUpdate", (data) => {
            console.log("Received progress update:", data)

            setPlayers((prevPlayers) =>
                prevPlayers.map((player) => (player._id === data.userId ? { ...player, progress: data.checkpoint } : player)),
            )
        })

        return () => {
            socket.off("progressUpdate")
        }
    }, [roomID])

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {players.map((player) => (
                            <div key={player._id} className="bg-white p-4 rounded-lg shadow">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-semibold">{player.username}</span>
                                    <span className="text-sm font-medium">{player.progress}/10</span>
                                </div>
                                <Progress value={player.progress * 10} className="w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminDashboard

