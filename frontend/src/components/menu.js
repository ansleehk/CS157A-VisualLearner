import './styles/menu.scss'

import CompanyIcon from './imgs/black-icon.png'

import ReaderIcon from './imgs/e-reader-icon.png'
import LightIcon from './imgs/lightbulb-icon.png'
import FieldOfStudyIcon from './imgs/field-icon.png'
import { Link } from 'react-router-dom'

export default function Menu() {
    return (
        <menu id="side-main">
            <Link to="/">
                <img id="company-icon" src={CompanyIcon} />
            </Link>

            <ul id="nav-btn-list">
                <li>
                    <Link to="/">
                        <img src={ReaderIcon} />
                    </Link>
                </li>
                <li>
                    <Link to="fieldSearch&List">
                        <img src={FieldOfStudyIcon} />
                    </Link>
                </li>
                <li>
                    <Link to="conceptSearch&List">
                        <img src={LightIcon} />
                    </Link>
                </li>

            </ul>
        </menu>
    )
}