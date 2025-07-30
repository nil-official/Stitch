import { Link } from 'react-router-dom'
import { STITCH_WHITE } from '../../assets/asset'
import { BASE_ROUTES } from '../../routes/routePaths';

const BrandLogo = () => {
    return (
        <Link to={BASE_ROUTES.HOME}>
            <img src={STITCH_WHITE} alt="Stitch" />
        </Link>
    )
}

export default BrandLogo;