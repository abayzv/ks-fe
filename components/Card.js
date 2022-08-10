export default function Card({ children, header }) {
  return (
    <div className="border bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5 border-b">{header}</div>
      <div className="p-5">{children}</div>
    </div>
  );
}
