export default function Card({ className = '', children }) {
  return (
    <div className={`glass rounded-2xl p-6 shadow-card ${className}`}>
      {children}
    </div>
  );
}