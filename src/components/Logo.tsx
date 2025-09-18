import { FaCodeBranch } from "react-icons/fa";



const Logo = () => {
    return (
        <div className="flex items-center space-x-2 mr-4">
            <FaCodeBranch className="text-yellow-400 text-2xl md:text-3xl" />
            <a
              href="/"
              className="text-yellow-400 font-extrabold text-xl md:text-2xl tracking-wider"
            >
              CodeClash
            </a>
          </div>
    );
};

export default Logo;


