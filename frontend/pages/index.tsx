import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`relative flex min-h-screen flex-col`}
    >
      <Header />

      <div className="border flex flex-col items-center justify-center h-[100vh] ">
        <h1 className="text-6xl mb-8">Sell Properties</h1>
        <p className="text-2xl">
          Sell your properties with the help of our platform
        </p>

        <button className="btn btn-contained btn-small mt-8 bg-black px-4 py-2 text-white">Get Started</button>
      </div>
     
    </main>
  );
}
