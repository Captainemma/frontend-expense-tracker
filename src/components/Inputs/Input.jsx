import React, { useState } from 'react'; // Added useState import
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false); // Fixed typo in setShowPassword

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Fixed the toggle logic
  };
  
  return (
    <div className="mb-4"> {/* Added margin bottom for spacing */}
      <label className="text-[13px] text-slate-800 block mb-1"> {/* Added block display */}
        {label}
      </label>
      <div className="relative border rounded-md p-2 flex items-center"> {/* Added styling */}
        <input 
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={onChange} // Simplified onChange
        />

        {type === 'password' && (
          <div className="absolute right-2"> {/* Positioned the eye icon */}
            {showPassword ? (
              <FaRegEye
                size={18}
                className="text-primary cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={18}
                className="text-slate-400 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;