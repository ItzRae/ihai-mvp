import React, { use, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { UserContext } from "../context/UserContext.jsx";
import { useContext } from "react";

const Navbar = () => {

    const [isScrolled, setIsScrolled] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const location = useLocation();

    {/* handle logout */}
      // read from context if available; fall back to localStorage
    //   // (works with your existing Register/Login that set localStorage)
    const accessToken = localStorage.getItem("access_token");
    const firstName = localStorage.getItem("first_name") || "User";
    const isAuthed = !!accessToken;

    const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    // if you have UserContext -> setToken(null); setUser(null);
    window.location.href = "/"; // simple reset; or use navigate("/")
    };

    const navItems = [
        {
            id: 1,
            name: "Home",
            path: "/",
        },
        {
            id: 2,
            name: "What We Do",
            path: "/about",
        },
        {
            id: 3,
            name: "Roles",
            path: "/roles",
        }

    ];


    const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div
            id="navbar"
            className={`fixed top-0 z-50 w-full h-[8ch] border-b border-neutral-200
             flex items-center justify-between px-4 sm:px-6 md:px-12
             bg-sky-50/85 backdrop-blur ${isScrolled ? 'shadow-md' : 'shadow-sm'}`} >

            {/* Logo section */}

            <div className="flex items-center gap-2 md:pr-16 pr-0">
                <Link to="/" className="text-lg font-semibold text-primaryDarkBlue">
                    <img src="../src/assets/images/ihai-logo-color.png" alt="IHAI Time" className="h-13 w-auto"/>
                </Link>
            </div>

            {/* hamburger menu for mobile */}
            <div className="md:hidden">
                <button className="text-neutral-600 focus:outline-none">
                    <FaBars size={24} /> 
                </button>
            </div>

            {/* nav links for desktop */}
            <div className={`fixed md:static top-0 right-0 -screen md:h-auto w-full
            md:w-auto bg-sky-50 border-1 md:border-none border-neutral-300
            md:bg-transparent shadow-lg md:shadow-none transition-all ease-in-out
            duration-300 transition-transform flex-1 ${open ? 'translate-x-0' : 'translate-x-full'}
            md:translate-x-0 z-60 `}>
                

                <div className="border-b border-neutral-300 md:hidden"></div>

                <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-0">
                    {/* Navbar items */}
                    <ul className="flex flex-col md:flex-row items-center gap-6 text-base text-neutral-700">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Link to={item.path} className="hover:text-sky-600 ease-in-out duration-300">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    
                    {/* Auth-aware buttons */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
                    {isAuthed ? (
                        <>
                        <span className="px-3 py-2 text-sm md:text-base text-neutral-700">
                            Welcome, <span className="font-semibold">{firstName}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="w-fit px-6 py-2 rounded-lg bg-neutral-800 hover:rounded-xl
                                    hover:bg-neutral-600 md:text-base text-2xl text-neutral-50
                                    hover:text-red-300 transition-all"
                        >
                            Logout
                        </button>
                        </>
                    ) : (
                        <>
                        <Link
                            to="/login"
                            className="w-fit px-6 py-2 md:text-base text-2xl
                                    text-neutral-800 hover:text-sky-700 transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="w-fit px-6 py-2 rounded-lg bg-neutral-800 hover:rounded-xl
                                    hover:bg-neutral-600 md:text-base text-2xl text-neutral-50
                                    hover:text-cyan-500 transition-all"
                            onClick={() => setOpen(false)}
                        >
                            Get Started
                        </Link>
                        </>
                    )}
                    </div>
                </div>
            </div>

        </div>

        

    )

}


export default Navbar;