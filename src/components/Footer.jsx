import "../css/Footer.css";
import { FaGithub } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { useMediaQuery } from "@mui/material";

function Footer() {
  const isMobile = useMediaQuery("(max-width:480px)");

  return (
    <footer className="footer">
      {isMobile ? (
        <></>
      ) : (
        <div className="footer__copy">
          &copy; {new Date().getFullYear()} Ifty Rahman
        </div>
      )}
      <div className="footer__links">
        <a
          className="footer__link"
          href="https://github.com/Ifty-Rahman/ALTrack"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          {isMobile ? (
            <FaGithub size={18} />
          ) : (
            <span className="footer__link-text">GitHub</span>
          )}
        </a>
        <a
          className="footer__link"
          href="mailto:Ifty09rahman@gmail.com"
          aria-label="Email"
        >
          {isMobile ? (
            <IoMdMail size={18} />
          ) : (
            <span className="footer__link-text">Email</span>
          )}
        </a>
      </div>
    </footer>
  );
}

export default Footer;
