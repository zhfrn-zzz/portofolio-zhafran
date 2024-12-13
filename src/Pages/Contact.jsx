import React, { useState } from "react"
import Komentar from "../components/commentar"
import { Send, Share2, MessageCircle, Mail, User } from "lucide-react"
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
        // Add actual form submission logic here
    }

    const InputField = ({ field, icon: Icon }) => (
        <div 
            key={field}
            className="relative group"
            onMouseEnter={() => setHoveredField(field)}
            onMouseLeave={() => setHoveredField(null)}
        >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 
                text-gray-400 group-focus-within:text-[#6366f1] transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <input 
                type={field === 'email' ? 'email' : (field === 'message' ? 'textarea' : 'text')}
                name={field}
                placeholder={`Your ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full p-4 pl-12 bg-white/10 rounded-xl border transition-all duration-300 
                    ${hoveredField === field 
                        ? 'border-[#6366f1] ring-2 ring-[#6366f1]/50' 
                        : 'border-white/20'
                    } 
                    text-white placeholder-gray-500 focus:outline-none
                    ${field === 'message' ? 'h-52' : ''}`}
                required
            />
            {hoveredField === field && (
                <div className="absolute inset-0 border-2 border-[#6366f1] rounded-xl animate-pulse-border pointer-events-none"></div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center py-12" id="Contact">
            <div className="container px-[1%] grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12">
                {/* Contact Form Section */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                                Get in Touch
                            </h2>
                            <p className="text-gray-400">
                                Ready to collaborate? Drop me a line below.
                            </p>
                        </div>
                        <Share2 className="w-10 h-10 text-[#6366f1] opacity-50" />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField field="name" icon={User} />
                        <InputField field="email" icon={Mail} />
                        <InputField field="message" icon={MessageCircle} />
                        
                        <button 
                            type="submit"
                            className="w-full p-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-xl 
                            hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-3 group"
                        >
                            <Send className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            Send Message
                        </button>
                    </form>

                    {/* Social Links */}
                    <div className="mt-10 pt-6 border-t border-white/10 flex justify-center space-x-6">
                        <SocialLinks/>
                    </div>
                </div>

                {/* Comment System Section */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 ">
                   <Komentar/>
                </div>
            </div>
        </div>
    )
}

export default ContactPage