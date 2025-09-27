export default function InputField({ label, value, onChange }) {
  return (
    <label className="block mb-3">
      <span className="text-sm text-gray-600">{label}</span>
      <input
        className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
