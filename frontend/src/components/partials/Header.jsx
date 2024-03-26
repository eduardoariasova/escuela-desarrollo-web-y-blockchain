function Header(){

    return(
        <div className="bg-dark">
            <div className="container">
                <header className="d-flex justify-content-center py-3">
                <ul className="nav nav-pills">
                    <li className="nav-item"><a href="/" className="nav-link active" aria-current="page">Home</a></li>
                    <li className="nav-item"><a target="_blank"  rel="noreferrer" href="https://eduardo-arias.com/" className="nav-link">Blog</a></li>
                    <li className="nav-item"><a target="_blank"  rel="noreferrer" href="https://eduardo-arias.com/links/" className="nav-link">Redes</a></li>
                    <li className="nav-item"><a target="_blank"  rel="noreferrer" href="https://streamlabs.com/eduardoariascol/tip" className="nav-link">Donar</a></li>
                    <li className="nav-item"><a  href="/loteria" className="nav-link">Loteria</a></li>
                </ul>
                </header>
            </div>
        </div>
    )
}

export default Header;