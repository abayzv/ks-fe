export const Input = (props) => (
  <input
    {...props}
    className="form-text border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full transition duration-200 rounded-lg"
  />
);

export const Label = ({ children, ...props }) => (
  <label {...props} className="text-sm mb-1 block capitalize">
    {children}
  </label>
);
export const Button = ({ color, children, type, ...props }) => (
  <button
    type={type ? type : "submit"}
    {...props}
    className={`px-4 h-10 rounded-lg ${color} text-white focus:ring focus:ring-gray-600 focus:outline-none`}
  >
    {children}
  </button>
);

export const Error = ({ message }) => (
  <div className="mt-2 text-red-500 font-medium text-sm">{message}</div>
);
