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
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(`https://ctf-round.onrender.com/admin/progress/${roomID}`)
                const data = await response.json()
                setPlayers(data)
            } catch (error) {
                console.error("Error fetching progress:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProgress()

        socket.emit("joinRoom", roomID)

        socket.on("progressUpdate", (data) => {
            // console.log("Received progress update:", data)
            setPlayers((prevPlayers) =>
                prevPlayers.map((player) => (player._id === data.userId ? { ...player, progress: data.checkpoint } : player)),
            )
        })

        return () => {
            socket.off("progressUpdate")
        }
    }, [roomID])

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 sm:p-6 md:p-8">
            <Card className="max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {players.map((player) => (
                                <Card key={player._id} className="bg-white shadow">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold truncate">{player.username}</span>
                                                <span className="text-xs font-medium">{player.progress}/10</span>
                                            </div>
                                            <Progress value={player.progress * 10} className="w-full" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminDashboard

