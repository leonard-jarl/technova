import Header from "./components/Header";
import logo from "./assets/logo.png";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop"
            alt="Macbook dator"
            className="w-full h-80 md:h-120 object-cover"
          />
          <section>
            <img src={logo} alt="logotyp" className="w-60" />
            <h1 className="text-5xl font-bold mt-4 mb-4">
              Smartare elektronik för ett smidigare liv.
            </h1>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              På TechNova designar och handplockar vi premiumelektronik som gör
              vardagen smartare, snabbare och mer uppkopplad. Från
              högpresterande laptops och tillbehör till smarta hem‑produkter och
              högtalare förenar våra produkter modern design med pålitlig
              prestanda. Upptäck teknik som är pålitlig och byggd för framtiden.
            </p>
          </section>
        </div>
      </main>
      <Chatbot />
    </>
  );
}
