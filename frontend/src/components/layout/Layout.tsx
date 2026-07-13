import type { ReactNode } from "react";

import Navbar from "./Navbar";

interface Props {
  children: ReactNode;
}

export default function Layout({
  children,
}: Props) {

  return (

    <>

      <Navbar />

      <main>

        {children}

      </main>

    </>

  );

}