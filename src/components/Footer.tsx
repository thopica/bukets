import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-background mt-4 relative z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-sm mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/how-to-play" className="text-muted-foreground hover:text-foreground transition-colors">
                  How to Play
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">About</h4>
            <p className="text-xs text-muted-foreground">
              © 2025 Bukets
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;