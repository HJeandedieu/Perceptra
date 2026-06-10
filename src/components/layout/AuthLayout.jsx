import authHero from '../../assets/images/auth-hero.jpg';

export default function AuthLayout({ children, imageTitle, imageUrl }) {
  return (
    <div className="min-h-screen flex bg-surface-950">
      <div className="w-1/2 hidden lg:block relative">
        <img 
          src={imageUrl || authHero} 
          alt="Security"
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-surface-950/70" />
        <div className="absolute bottom-12 left-12 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-4">{imageTitle || "Secure Your Perimeter"}</h2>
          <p className="text-gray-300">PERCEPTRA real-time threat detection system.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
