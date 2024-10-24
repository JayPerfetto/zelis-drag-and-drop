import { useDarkMode } from "~/hooks/useDarkMode"; // Import the custom hook for dark mode

export default function DarkModePage() {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Destructure values from the custom hook

  return (
    <div
      className={`min-h-screen p-10 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6">Dark Mode Example</h1>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
      >
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      <p className="mt-4">
        The current mode is <strong>{darkMode ? "Dark" : "Light"}</strong>!
      </p>
    </div>
  );
}
