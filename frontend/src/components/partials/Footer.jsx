function Footer(){
    return(
        <div className="bg-dark">
            <div className="container">
                <footer className="py-3 my-4">
                    <ul className="nav justify-content-center border-bottom pb-3 mb-3" style={{color: "white !important"}}>
                        <li className="nav-item"><a href="/" className="nav-link px-2 text-light">Home</a></li>
                        <li className="nav-item"><a target="_blank" rel="noreferrer" href="https://eduardo-arias.com/" className="nav-link px-2 text-light">Blog</a></li>
                        <li className="nav-item"><a target="_blank" rel="noreferrer" href="https://eduardo-arias.com/links" className="nav-link px-2 text-light">Redes</a></li>
                        <li className="nav-item"><a target="_blank" rel="noreferrer" href="https://streamlabs.com/eduardoariascol/tip" className="nav-link px-2 text-light">Donar</a></li>
                    </ul>
                    <p className="text-center text-light">&copy; 2023 Eduardo Arias</p>
                </footer>
            </div>
        </div>
    )
}

export default Footer;