import "../css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__copy">
        &copy; {new Date().getFullYear()} Ifty Rahman
      </div>
      <div className="footer__links">
        <a
          className="footer__link"
          href="https://github.com/Ifty-Rahman"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a className="footer__link" href="mailto:Ifty09rahman@gmail.com">
          Email
        </a>
      </div>
    </footer>
  );
}

export default Footer;
