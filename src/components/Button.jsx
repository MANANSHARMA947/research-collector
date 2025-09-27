import { motion } from "framer-motion";

const button = ({ text, onClick })=> {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      onClick={onClick}
    >
      {text}
    </motion.button>
  );
}
 export default button;