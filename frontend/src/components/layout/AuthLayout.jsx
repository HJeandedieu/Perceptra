import authHero from '../../assets/images/auth-hero.jpg';

export default function AuthLayout({ children, imageTitle }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0a0b10' }}>
      {/* Image side */}
      <div className="w-1/2 hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={authHero} 
            alt="Security"
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,11,16,0.85) 0%, rgba(10,11,16,0.4) 50%, rgba(10,11,16,0.85) 100%)' }} />
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-4xl font-bold text-white mb-3">{imageTitle || "Secure Your Perimeter"}</h2>
            <p className="text-gray-300 text-sm">PERCEPTRA real-time threat detection system powered by YOLOv8 AI.</p>
          </div>
        </div>
      </div>
      
      {/* Form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-2xl p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
