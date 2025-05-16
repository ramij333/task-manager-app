"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter } from "lucide-react";

const priorities = ["low", "medium", "high"];
const statuses = ["pending", "completed"];

type Props = {
  onSearch: (
    query: string,
    filters: {
      priority?: string;
      status?: string;
      dueDate?: string;
    }
  ) => void;
  onClear: () => void;
};

export default function TaskSearchBar({ onSearch, onClear }: Props) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearch = () => {
    onSearch(query.trim(), {
      priority,
      status,
      dueDate: dueDate?.toISOString().split("T")[0],
    });
  };

  const handleClear = () => {
    setQuery("");
    setPriority(undefined);
    setStatus(undefined);
    setDueDate(undefined);
    onClear();
  };

  return (
    <div className="flex w-full flex-wrap justify-center items-center gap-2 px-4 md:px-10 mb-4">
      <Input
        type="text"
        placeholder="Search tasks..."
        className="max-w-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="space-y-4 w-70">
          <div className="space-y-1">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {priorities.map((level) => (
                <Button
                  key={level}
                  size="sm"
                  variant={priority === level ? "default" : "outline"}
                  onClick={() => setPriority(level === priority ? undefined : level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((stat) => (
                <Button
                  key={stat}
                  size="sm"
                  variant={status === stat ? "default" : "outline"}
                  onClick={() => setStatus(stat === status ? undefined : stat)}
                >
                  {stat.charAt(0).toUpperCase() + stat.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Due Date</Label>
            <div className="flex items-center gap-2 mt-1">
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
               
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );
}








// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Label } from "@/components/ui/label";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon, Filter } from "lucide-react";

// type Props = {
//   onSearch: (query: string, filters: {
//     priority?: string;
//     status?: string;
//     dueDate?: string;
//   }) => void;
//   onClear: () => void;
// };

// export default function TaskSearchBar({ onSearch, onClear }: Props) {
//   const [query, setQuery] = useState("");
//   const [priority, setPriority] = useState("");
//   const [status, setStatus] = useState("");
//   const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
//   const [filterOpen, setFilterOpen] = useState(false);

//   const handleSearch = () => {
//     onSearch(query, {
//       priority: priority || undefined,
//       status: status || undefined,
//       dueDate: dueDate?.toISOString().split("T")[0],
//     });
//   };

//   const handleClear = () => {
//     setQuery("");
//     setPriority("");
//     setStatus("");
//     setDueDate(undefined);
//     onClear();
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-2 px-4 md:px-10 mb-4">
//       <Input
//         type="text"
//         placeholder="Search tasks..."
//         className="max-w-sm"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//       <Button onClick={handleSearch}>Search</Button>
//       <Popover open={filterOpen} onOpenChange={setFilterOpen}>
//         <PopoverTrigger asChild>
//           <Button variant="outline" className="flex items-center gap-1">
//             <Filter className="h-4 w-4" />
//             Filter
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="space-y-4 w-64">
//           <div>
//             <Label>Priority</Label>
//             <select
//               className="w-full border rounded px-2 py-1 mt-1"
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//             >
              
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>
//           <div>
//             <Label>Status</Label>
//             <select
//               className="w-full border rounded px-2 py-1 mt-1"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//             >
              
//               <option value="pending">Pending</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>
//           <div>
//             <Label>Due Date</Label>
//             <div className="flex items-center gap-2 mt-1">
//               <CalendarIcon className="w-4 h-4 text-muted-foreground" />
//               <Calendar
//                 mode="single"
//                 selected={dueDate}
//                 onSelect={setDueDate}
//               />
//             </div>
//           </div>
//         </PopoverContent>
//       </Popover>
//       <Button variant="ghost" onClick={handleClear}>
//         Clear
//       </Button>
//     </div>
//   );
// }

