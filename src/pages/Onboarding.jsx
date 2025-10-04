// src/pages/Onboarding.jsx
import { motion } from "framer-motion";

export default function Onboarding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold text-blue-600 mb-4"
        >
          Welcome to Research Collector 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-600 mb-6"
        >
          Save highlighted research snippets directly into{" "}
          <span className="font-semibold">Notion</span> or{" "}
          <span className="font-semibold">Google Drive</span> with a single
          click.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          <button
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
            onClick={() => (window.location.href = "options.html")}
          >
            ⚙️ Configure Settings
          </button>

          <button
            className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
            onClick={() => window.open("https://github.com", "_blank")}
          >
            📘 Learn More
          </button>
        </motion.div>

        <p className="text-xs text-gray-400 mt-6">
          Tip: Right-click highlighted text → Save to Notion / Google Drive
        </p>
      </motion.div>
    </div>
  );
}
