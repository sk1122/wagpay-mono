import Navbar from '@/components/Navbar';
import type { ReactNode } from 'react';



type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="mx-auto h-fit w-full px-1 antialiased dark:bg-primaryDark dark:text-white lg:h-screen">
    {props.meta}
    <div className="mx-auto max-w-7xl">
      {props.children}
    </div>
  </div>
);

export { Main };