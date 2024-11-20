import React from "react";
import { faGithub, faBluesky , faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { URLs } from "../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "../components/Link";


const SocialIcons = () => {
	return (
		<ul className="footer__social">
			<li>
				<Link destination={URLs.github}>
					<FontAwesomeIcon icon={faGithub} />
				</Link>
			</li>
			<li>
				<Link destination={URLs.bluesky}>
					<FontAwesomeIcon icon={faBluesky} />
				</Link>
			</li>
			<li>
				<Link destination={URLs.instagram}>
					<FontAwesomeIcon icon={faInstagram} />
				</Link>
			</li>
			<li>
				<Link destination={URLs.discord}>
					<FontAwesomeIcon icon={faDiscord} />
				</Link>
			</li>
		</ul>
	);
}

export default SocialIcons;