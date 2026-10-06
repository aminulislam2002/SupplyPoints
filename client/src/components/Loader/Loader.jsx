import logo from "../../assets/logo/logo.png";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-page-bg/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <img
          src={logo}
          alt="Supply Points Logo"
          className="h-20 w-20 rounded-xl object-cover shadow-lg lg:h-24 lg:w-24"
        />
        <span className="caption animate-pulse">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
