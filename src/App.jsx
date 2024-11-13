import "./index.css"
import Home from "./Pages/Home"
import About from "./Pages/About"
import AnimatedBackground from "./components/Background"
import Navbar from "./components/Navbar"
import Portofolio from "./Pages/Portofolio"
import ContactForm from "./Pages/Contact"
import PortfolioCommentSystem from "./Pages/Comment"

function App() {
	return (
		<>
			<Navbar />
			<AnimatedBackground />
			<Home />
			<About />
			<Portofolio />
			<ContactForm />
			<PortfolioCommentSystem />
			<footer>
				<hr class="my-3 border-gray-400 opacity-15 sm:mx-auto  lg:my-6" />
				<span class="block text-sm pb-4 text-gray-500 sm:text-center dark:text-gray-400">
					© 2023{" "}
					<a href="https://flowbite.com/" class="hover:underline">
						EkiZR™
					</a>
					. All Rights Reserved.
				</span>
			</footer>
		</>
	)
}

export default App
