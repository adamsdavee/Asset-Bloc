import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/layout/header";
import PaddedContainer from "@/components/layout/padded-container";
import CreateNewForm from "@/components/events/CreateNewForm";

const inter = Inter({ subsets: ["latin"] });

export default function New() {
  return (
    <main
      className={`relative flex min-h-screen flex-col`}
    >
      <Header />


      <div className="border border-red-300 mt-[60px]  h-[calc(100vh-60px)] ">
        <PaddedContainer>
          <h1 className="text-4xl mb-4">Create New</h1>
        
          <CreateNewForm />
        </PaddedContainer>
        
      </div>
     
    </main>
  );
}
