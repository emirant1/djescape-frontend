import './Footer.css';

const Footer = () => {

    interface SocialMedia {
        name: string;
        url: string;
        imagePath: string
    }

    const socialMediaElements: SocialMedia[] = [
        { name: 'Facebook', url: "https://facebook.com/escape_usd", imagePath: "/images/socialmedia/facebook-icon.svg" },
        { name: 'Instagram', url: "https://instagram.com/escape_usd", imagePath: "/images/socialmedia/instagram-icon.svg" },
        { name: 'Email', url: "mailto:Boris.Stjepanovic@rado.com", imagePath: "/images/socialmedia/email-icon.svg" }
    ];

    return (
        <footer>
            <div className="footer">
                {
                    socialMediaElements.map((sm) => {
                        return (
                            <a key={ sm.name } href={ sm.url } target="_blank">
                                <img src={ sm.imagePath } alt={ sm.name } />
                            </a>
                        );
                    })
                }
            </div>
        </footer>
    );
}

export default Footer;