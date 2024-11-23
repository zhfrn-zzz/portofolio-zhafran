import React, { useState } from "react"
import Komentar from "../components/commentar"
import { Send,Share2 } from "lucide-react"
import SocialLinks from "../components/SocialLinks"


const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })
    const [hoveredField, setHoveredField] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
    }

   

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full mx-[10%] flex flex-col md:flex-row gap-8">
                {/* Contact Form Section */}
                <div className="w-full md:w-[35%] bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-12 relative">
                    <div className="absolute top-6 right-6">
                        <Share2 className="w-8 h-8 text-[#6366f1] opacity-50" />
                    </div>
                    
                    <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                        Contact Me
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Have something to discuss? Send me a message and let's talk.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {['name', 'email', 'message'].map((field) => (
                            <div 
                                key={field}
                                className="relative group"
                                onMouseEnter={() => setHoveredField(field)}
                                onMouseLeave={() => setHoveredField(null)}
                            >
                                <input 
                                    type={field === 'email' ? 'email' : (field === 'message' ? 'text' : 'text')}
                                    name={field}
                                    placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    className={`w-full p-4 bg-white/10 rounded-lg border transition-all duration-300 
                                        ${hoveredField === field 
                                            ? 'border-[#6366f1] ring-2 ring-[#6366f1]/50' 
                                            : 'border-white/20'
                                        } 
                                        text-white placeholder-gray-500 focus:outline-none
                                        ${field === 'message' ? 'h-32' : ''}`}
                                    required
                                />
                                {hoveredField === field && (
                                    <div className="absolute inset-0 border-2 border-[#6366f1] rounded-lg animate-pulse-border pointer-events-none"></div>
                                )}
                            </div>
                        ))}
                        
                        <button 
                            type="submit"
                            className="w-full p-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-lg 
                            hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 group"
                        >
                            <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Send Message
                        </button>
                    </form>

                    {/* Social Links */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <SocialLinks/>
                    </div>
                </div>

                {/* Comment System Section */}
                <div className="w-full md:w-[65%]">
                   <Komentar/>
                </div>
            </div>
        </div>
    )
}

export default ContactPage