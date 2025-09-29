import * as Motion from "framer-motion";

// Then use it as:

const Button = ({ text, onClick }) => {
  return (
    <Motion.motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      onClick={onClick}>
      {text}
    </Motion.motion.button>
  );
};

export default Button;
