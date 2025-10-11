import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="border-t border-border mt-16 relative z-10">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-base mb-3">NBA Daily Quiz</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Test your basketball knowledge with daily stat-based challenges.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-3">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/how-to-play" className="text-muted-foreground hover:text-foreground transition-colors touch-target block py-1">
                  How to Play
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors touch-target block py-1">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base mb-3">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors touch-target block py-1">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors touch-target block py-1">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2025 NBA Daily Quiz. </p>
        </div>
      </div>
    </footer>;
};
export default Footer;