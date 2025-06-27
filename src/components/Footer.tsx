export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <img src="/logos/elevenlabs.png" alt="ElevenLabs" className="h-4" />
            <span>Voice AI</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/logos/revenuecat.png" alt="RevenueCat" className="h-4" />
            <span>Payments</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/logos/reddit.png" alt="Reddit" className="h-4" />
            <span>Social</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/logos/ionos.png" alt="IONOS" className="h-4" />
            <span>Domains</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/logos/netlify.png" alt="Netlify" className="h-4" />
            <span>Deploy</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="/logos/supabase.png" alt="Supabase" className="h-4" />
            <span>Database</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t text-center text-xs text-gray-500">
          <p>AI Roast Generator - Built for Bolt.new Hackathon 2024</p>
        </div>
      </div>
    </footer>
  )
}