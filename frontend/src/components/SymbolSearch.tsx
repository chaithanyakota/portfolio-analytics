"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

type SearchResult = {
  symbol: string;
  description: string;
  type: string;
};

export function SymbolSearch({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (symbol: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get<SearchResult[]>("/market-data/search", {
        params: { q },
      });
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  function handleSelect(result: SearchResult) {
    onSelect(result.symbol);
    setSelectedLabel(`${result.description} (${result.symbol})`);
    setOpen(false);
    setQuery("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selectedLabel || "Search stock..."}
          </span>
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by company or symbol..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            {!loading && query.length > 0 && results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
            {!loading && results.length > 0 && (
              <CommandGroup>
                {results.map((r) => (
                  <CommandItem
                    key={r.symbol}
                    value={r.symbol}
                    onSelect={() => handleSelect(r)}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 size-4",
                        value === r.symbol ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">
                      {r.description}{" "}
                      <span className="text-muted-foreground">({r.symbol})</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
