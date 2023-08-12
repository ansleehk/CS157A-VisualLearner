import "./styles/sub-setting-menu.scss"

import CloseIcon from './imgs/close-icon.png'

export default function SubSettingMenu(props){
    const closeMenu = () => {
        props.windowDisplayFunction(false)
    }

    return (
        <menu className="sub-setting">
            <img onClick={closeMenu} className="close-icon" src={CloseIcon} />
        </menu>
    )
}