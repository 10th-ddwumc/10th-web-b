import { Link } from "react-router-dom";

const Footer = () => {
    return <footer className="bg-gray-100 p-4 text-center text-gray-500">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} SYOON PAGE. All rights reserved.</p>
        
            <div className={"flex justify-center space-x-4 mt-4"}>
                <Link to={"#"}>Privacy Policy</Link>
                <Link to={"#"}>Terms of Service</Link>
                <Link to={"#"}>Contact Us</Link>
            </div>
        </div> 
    </footer>
}

export default Footer;