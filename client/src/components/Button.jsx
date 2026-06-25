export default function Button({ variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };
  return <button className={`${variants[variant]} ${className}`} {...props} />;
}