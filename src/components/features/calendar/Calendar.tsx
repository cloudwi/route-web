"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  diaries: Array<{
    id: string;
    date: string; // YYYY-MM-DD format
    user: string;
    place: string;
    comment: string;
    image?: string;
  }>;
  onDateClick?: (date: string) => void;
}

export default function Calendar({ diaries, onDateClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Create calendar grid
  const calendarDays: Array<{ date: number; month: 'prev' | 'current' | 'next'; fullDate: string }> = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const prevMonthDate = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    calendarDays.push({
      date: prevMonthDate,
      month: 'prev',
      fullDate: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevMonthDate).padStart(2, '0')}`
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: i,
      month: 'current',
      fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    });
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    calendarDays.push({
      date: i,
      month: 'next',
      fullDate: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    });
  }

  // Get diaries for a specific date
  const getDiariesForDate = (fullDate: string) => {
    return diaries.filter(diary => diary.date === fullDate);
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="rounded-3xl p-6" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-soft)',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 rounded-xl transition-all"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-card-hover)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {year}년 {month + 1}월
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl transition-all"
          style={{
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-card-hover)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            key={day}
            className="text-center py-2 text-sm font-medium"
            style={{
              color: index === 0 ? 'var(--accent)' : index === 6 ? 'var(--primary)' : 'var(--text-tertiary)'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayDiaries = getDiariesForDate(day.fullDate);
          const isToday = day.fullDate === today;
          const isCurrentMonth = day.month === 'current';

          return (
            <button
              key={index}
              onClick={() => onDateClick && dayDiaries.length > 0 && onDateClick(day.fullDate)}
              className="aspect-square p-2 rounded-xl transition-all relative"
              style={{
                background: isToday ? 'var(--gradient-warm)' : 'transparent',
                border: isToday ? '1px solid var(--border-medium)' : '1px solid transparent',
                opacity: isCurrentMonth ? 1 : 0.3,
                cursor: dayDiaries.length > 0 ? 'pointer' : 'default'
              }}
              onMouseEnter={(e) => {
                if (dayDiaries.length > 0 && isCurrentMonth) {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-soft)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isToday) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                } else {
                  e.currentTarget.style.background = 'var(--gradient-warm)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }
              }}
            >
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {day.date}
              </div>
              {dayDiaries.length > 0 && (
                <div className="flex gap-0.5 justify-center mt-1">
                  {dayDiaries.slice(0, 3).map((diary, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--primary)' }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
