import React, { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <header>
        {/* Add header content here */}
      </header>
      <main>
        {children}
      </main>
      <footer>
        {/* Add footer content here */}
      </footer>
    </div>
  );
};

export default RootLayout;
