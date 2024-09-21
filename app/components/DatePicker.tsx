"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSearchParams } from "next/navigation"

export function DatePicker() {
    const params=useSearchParams();
    const [isOpen,setIsOpen]=React.useState(false);
  const [date, setDate] = React.useState<Date>()
 
React.useEffect(()=>{
const date=params.get('date');
if(date){
    const dateobj=parse(date!,'M/d/yyyy',new Date())
    setDate(dateobj)
}
},[params])

const handleDateChange=(date:Date)=>{
    //@ts-ignore
    const formattedDate=format(date,'M/d/yyyy');
    console.log("date here ",formattedDate);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('date', formattedDate);
    // Update the URL without reloading the page
    window.history.replaceState({}, '', newUrl.toString());
    setIsOpen(false);
}


  return (
    <Popover
    open={isOpen}
    onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            `w-[280px] justify-start text-left font-normal  
            rounded-xl
            border-primary
            bg-slate-50
            `,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 text-primary h-4 w-4" />
          {date ? format(date, "PPP") : <span className="">Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
      
      className="w-auto p-0
      z-50
      ">
        <Calendar
        className="bg-white"
          mode="single"
          selected={date}
          onSelect={(date)=>{
            setDate(date)
            handleDateChange(date!);
        }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
