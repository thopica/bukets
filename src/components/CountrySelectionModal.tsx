import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/utils/countries";
import { toast } from "sonner";

interface CountrySelectionModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const CountrySelectionModal = ({ isOpen, onComplete }: CountrySelectionModalProps) => {
  const [countryCode, setCountryCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!countryCode) {
      toast.error("Please select your country");
      return;
    }

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to set your country");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ country_code: countryCode })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Country set successfully!");
      onComplete();
    } catch (error) {
      console.error('Error saving country:', error);
      toast.error("Failed to save country. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Welcome! 👋</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Select your country to compete on regional leaderboards and see how you rank against players from your area.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="country-select">Country</Label>
            <Select value={countryCode} onValueChange={setCountryCode} disabled={isLoading}>
              <SelectTrigger id="country-select" className="h-12">
                <SelectValue placeholder="Choose your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={!countryCode || isLoading}
            className="w-full h-12 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up your profile...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountrySelectionModal;
