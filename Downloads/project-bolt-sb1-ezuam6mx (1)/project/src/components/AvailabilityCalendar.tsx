import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface AvailabilityCalendarProps {
  unavailableDates?: string[];
  onDateSelect?: (date: string) => void;
  className?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  unavailableDates = [],
  onDateSelect,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const today = new Date();
  
  // Generate 12 months starting from current month
  const generateCalendarMonths = () => {
    const calendarMonths = [];
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      calendarMonths.push(monthDate);
    }
    
    return calendarMonths;
  };
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const isDateUnavailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return unavailableDates.includes(dateString);
  };
  
  const isDatePast = (date: Date) => {
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };
  
  const handleDateClick = (date: Date) => {
    if (!isDatePast(date) && !isDateUnavailable(date)) {
      onDateSelect?.(date.toISOString().split('T')[0]);
    }
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev' && currentDate.getMonth() > today.getMonth()) {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (direction === 'next') {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const calendarMonths = generateCalendarMonths();
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            disabled={currentDate.getMonth() <= today.getMonth() && currentDate.getFullYear() <= today.getFullYear()}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {calendarMonths.slice(0, 2).map((monthDate, monthIndex) => (
          <div key={monthIndex} className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 text-center">
              {months[monthDate.getMonth()]} {monthDate.getFullYear()}
            </h4>
            
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
              {daysOfWeek.map((day) => (
                <div key={day} className="py-2 font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(monthDate).map((date, dayIndex) => {
                if (!date) {
                  return <div key={dayIndex} className="p-2" />;
                }
                
                const isPast = isDatePast(date);
                const isUnavailable = isDateUnavailable(date);
                const isToday = date.toDateString() === today.toDateString();
                
                return (
                  <button
                    key={dayIndex}
                    onClick={() => handleDateClick(date)}
                    disabled={isPast || isUnavailable}
                    className={`
                      p-2 text-sm rounded-lg transition-colors relative
                      ${isPast 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : isUnavailable 
                          ? 'text-gray-400 cursor-not-allowed line-through' 
                          : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                      }
                      ${isToday ? 'bg-blue-100 text-blue-600 font-medium' : ''}
                    `}
                  >
                    {date.getDate()}
                    {isUnavailable && (
                      <div className="absolute inset-0 bg-red-100 rounded-lg opacity-50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span>Past dates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar; 