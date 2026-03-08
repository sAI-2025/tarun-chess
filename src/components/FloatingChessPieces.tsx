import { motion } from "framer-motion";

const chessPieces = [
  { symbol: "♔", x: "8%", y: "15%", size: "text-4xl", delay: 0, duration: 6 },
  { symbol: "♕", x: "85%", y: "20%", size: "text-3xl", delay: 1.2, duration: 7 },
  { symbol: "♘", x: "15%", y: "70%", size: "text-5xl", delay: 0.5, duration: 5.5 },
  { symbol: "♗", x: "90%", y: "65%", size: "text-3xl", delay: 2, duration: 6.5 },
  { symbol: "♖", x: "50%", y: "10%", size: "text-2xl", delay: 0.8, duration: 7.5 },
  { symbol: "♙", x: "75%", y: "80%", size: "text-2xl", delay: 1.5, duration: 5 },
  { symbol: "♚", x: "30%", y: "85%", size: "text-3xl", delay: 2.5, duration: 6 },
  { symbol: "♞", x: "65%", y: "12%", size: "text-4xl", delay: 0.3, duration: 8 },
];

const FloatingChessPieces = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {chessPieces.map((piece, i) => (
        <motion.span
          key={i}
          className={`absolute ${piece.size} text-primary/10 select-none`}
          style={{ left: piece.x, top: piece.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 0.15, 0.08, 0.15, 0],
            y: [20, -15, 10, -10, 20],
            rotate: [0, 8, -5, 3, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {piece.symbol}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingChessPieces;
