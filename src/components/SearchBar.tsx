
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback } from "react";
import debounce from "lodash/debounce";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  // Debounce the search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearchChange(term);
    }, 500),
    []
  );

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search hospitals and clinics..."
        defaultValue={searchTerm}
        onChange={(e) => debouncedSearch(e.target.value)}
        className="pl-10 pr-4 py-2 w-full bg-white text-gray-900 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
};

export default SearchBar;
