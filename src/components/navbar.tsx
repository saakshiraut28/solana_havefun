/** @format */

const Navbar = () => {
  return (
    <>
      <div className="relative z-10 px-8 flex items-center justify-between px-4 py-2 bg-white rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] ">
        <div className="text-3xl font-libre font-medium">Have Fun.</div>
        <appkit-button />
        <appkit-network-button />
      </div>
    </>
  );
};

export default Navbar;
