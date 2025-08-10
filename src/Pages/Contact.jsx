import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import { Link } from "react-router-dom";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
      mirror: true,
      offset: 0,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: 'Mengirim Pesan...',
      html: 'Harap tunggu selagi kami mengirim pesan Anda',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Ganti dengan email Anda di FormSubmit
      const formSubmitUrl = 'https://formsubmit.co/zhafranant@gmail.com';
      
      // Siapkan data form untuk FormSubmit
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('_subject', 'Pesan Baru dari Website Portfolio');
      submitData.append('_captcha', 'false'); // Nonaktifkan captcha
      submitData.append('_template', 'table'); // Format email sebagai tabel

      await axios.post(formSubmitUrl, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

     
      Swal.fire({
        title: 'Berhasil!',
        text: 'Pesan Anda telah berhasil terkirim!',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        timer: 2000,
        timerProgressBar: true
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });

    } catch (error) {
      if (error.request && error.request.status === 0) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pesan Anda telah berhasil terkirim!',
          icon: 'success',
          confirmButtonColor: '#6366f1',
          timer: 2000,
          timerProgressBar: true
        });

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan. Silakan coba lagi nanti.',
          icon: 'error',
          confirmButtonColor: '#6366f1'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="px-[5%] sm:px-[5%] lg:px-[10%] " style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7]"
        >
          Hubungi Saya
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="dark:text-slate-400 text-lighttext/80 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Punya pertanyaan? Kirimi saya pesan, dan saya akan segera membalasnya.
        </p>
      </div>

      <div
        className="h-auto py-10 flex items-center justify-center 2xl:pr-[3.1%] lg:pr-[3.8%]  md:px-0"
        id="Contact"
      >
        <div className="container px-[1%] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[45%_55%] 2xl:grid-cols-[35%_65%] gap-12" >
          <div
            className="dark:bg-white/5 bg-lightaccent/10 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-500 hover:shadow-[#6366f1]/10 border dark:border-white/10 border-lightaccent/30"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-3 text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7]">
                  Hubungi
                </h2>
                <p className="dark:text-gray-400 text-lighttext/80">
                  Ada yang ingin didiskusikan? Kirim saya pesan dan mari kita bicara.
                </p>
              </div>
              <Share2 className="w-10 h-10 dark:text-[#6366f1] text-[var(--accent)] opacity-50" />
            </div>

            <form 
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="relative group"
              >
                <User className="absolute left-4 top-4 w-5 h-5 dark:text-gray-400 text-lighttext/60 group-focus-within:dark:text-[#6366f1] group-focus-within:text-[var(--accent)] transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 dark:bg-white/10 bg-white rounded-xl border dark:border-white/20 border-lightaccent/30 placeholder-gray-500 dark:text-white text-lighttext focus:outline-none focus:ring-2 dark:focus:ring-[#6366f1]/30 focus:ring-[var(--accent)]/30 transition-all duration-300 hover:dark:border-[#6366f1]/30 hover:border-lightaccent/50 disabled:opacity-50"
                  required
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="relative group"
              >
                <Mail className="absolute left-4 top-4 w-5 h-5 dark:text-gray-400 text-lighttext/60 group-focus-within:dark:text-[#6366f1] group-focus-within:text-[var(--accent)] transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Anda"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 dark:bg-white/10 bg-white rounded-xl border dark:border-white/20 border-lightaccent/30 placeholder-gray-500 dark:text-white text-lighttext focus:outline-none focus:ring-2 dark:focus:ring-[#6366f1]/30 focus:ring-[var(--accent)]/30 transition-all duration-300 hover:dark:border-[#6366f1]/30 hover:border-lightaccent/50 disabled:opacity-50"
                  required
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="relative group"
              >
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 dark:text-gray-400 text-lighttext/60 group-focus-within:dark:text-[#6366f1] group-focus-within:text-[var(--accent)] transition-colors" />
                <textarea
                  name="message"
                  placeholder="Pesan Anda"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full resize-none p-4 pl-12 dark:bg-white/10 bg-white rounded-xl border dark:border-white/20 border-lightaccent/30 placeholder-gray-500 dark:text-white text-lighttext focus:outline-none focus:ring-2 dark:focus:ring-[#6366f1]/30 focus:ring-[var(--accent)]/30 transition-all duration-300 hover:dark:border-[#6366f1]/30 hover:border-lightaccent/50 h-[9.9rem] disabled:opacity-50"
                  required
                />
              </div>
              <button
                data-aos="fade-up"
                data-aos-delay="400"
                type="submit"
                disabled={isSubmitting}
                className="w-full dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-lightaccent text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t dark:border-white/10 border-lightaccent/30 flex justify-center space-x-6">
              <SocialLinks />
            </div>
          </div>

          <div className="  dark:bg-white/5 bg-lightaccent/10 backdrop-blur-xl rounded-3xl p-3 py-3 md:p-10 md:py-8 shadow-2xl transform transition-all duration-500 hover:shadow-[#6366f1]/10 border dark:border-white/10 border-lightaccent/30">
            <Komentar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;