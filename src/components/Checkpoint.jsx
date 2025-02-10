'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const CheckpointTenCelebration = () => {
    const [windowSize, setWindowSize] = useState({ width: 300, height: 300 });

    // Update confetti dimensions on window resize
    useEffect(() => {
        const handleResize = () =>
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 overflow-hidden">
            {/* Confetti explosion */}
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                numberOfPieces={250}
                recycle={false}
                gravity={0.3}
            />

            {/* Animated congratulatory message */}
            {/* <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500"> */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center text-white p-8 bg-white/20 rounded-xl shadow-lg"
            >
                <h1 className="text-3xl font-bold mb-4">Congratulations! 🎉</h1>
                <p className="text-lg">You have successfully completed the round.</p>
                <p className="text-md mt-2">Well done on clearing all 10 checkpoints!</p>
            </motion.div>
            {/* </div> */}
        </div>
    );
};

export default CheckpointTenCelebration;
