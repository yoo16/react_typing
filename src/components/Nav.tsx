import React, { useEffect, useState }  from 'react'

interface Props {
    gameType: string,
    selectMenu: any,
}

export const Nav = (props: Props) => {
    const [gameType, setGameType] = useState<string>('');

    useEffect(() => {
    })

    const selectMenu = (e:any) => {
        // console.log(e.target.dataset.type);
        props.selectMenu(e.target.dataset.type)
    } 
    return (
        <nav id="navbar-main" className="navbar navbar-expand-md navbar-default">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#" data-type="kana50" onClick={selectMenu}>五十音</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" data-type="alphabet" onClick={selectMenu}>アルファベット</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav