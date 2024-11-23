import React, { useState } from "react"
import { Linkedin, Github, Instagram, Youtube } from "lucide-react"

const socialIcons = {
    Linkedin: Linkedin,
    Github: Github,
    Instagram: Instagram,
    Youtube: Youtube,
    Tiktok: (props) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564" />
        </svg>
    )
}

const SocialLink = ({ Icon, link, brandColor }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-14 h-14 rounded-2xl flex items-center justify-center
                       transition-all duration-300 ease-in-out
                       transform hover:scale-110"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: `linear-gradient(145deg, ${brandColor}20, ${brandColor}10)`,
                boxShadow: `
                    -5px -5px 10px ${brandColor}15,
                    5px 5px 10px ${brandColor}20,
                    inset -2px -2px 4px ${brandColor}10,
                    inset 2px 2px 4px ${brandColor}05
                `
            }}
        >
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                            transition-opacity duration-300 blur-xl -z-10"
                style={{
                    background: `radial-gradient(circle at center, ${brandColor}30, transparent 70%)`
                }}
            />
           
            <Icon
                className={`w-7 h-7  transition-all duration-300 ${
                    isHovered
                        ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                        : 'text-white/70'
                }`}
                strokeWidth={isHovered ? 2 : 1.5}
            />
            {isHovered && (
                <div
                    className="absolute bottom-full mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ pointerEvents: 'none' }}
                >
                    {link.split('//')[1].split('/')[0]}
                </div>
            )}
        </a>
    )
}

const socialLinks = [
    {
        Icon: socialIcons.Linkedin,
        link: "https://linkedin.com/in/ekizulfarrachman",
        brandColor: "#0a66c2"
    },
    {
        Icon: socialIcons.Github,
        link: "https://github.com/ekizulfarrachman",
        brandColor: "#0a66c2"
    },
    {
        Icon: socialIcons.Instagram,
        link: "https://instagram.com/ekizulfarrachman",
        brandColor: "#0a66c2"
    },
    {
        Icon: socialIcons.Youtube,
        link: "https://youtube.com/@ekizulfarrachman",
        brandColor: "#0a66c2"
    },
    {
        Icon: socialIcons.Tiktok,
        link: "https://tiktok.com/@ekizulfarrachman",
        brandColor: "#0a66c2"
    }
]

export default () => (
    <div className="flex justify-center space-x-6">
        {socialLinks.map((link, index) => (
            <SocialLink
                key={index}
                Icon={link.Icon}
                link={link.link}
                brandColor={link.brandColor}
            />
        ))}
    </div>
)