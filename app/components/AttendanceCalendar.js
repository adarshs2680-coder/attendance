"use client";
import {useState} from "react";
export default function AttendanceCalendar({
  selectedDate,
  setSelectedDate,
  attendance,
})  {
    
    const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.toLocaleString("default", {
  month: "long",
});

const year = currentDate.getFullYear();
const daysInMonth = new Date(
  year,
  currentDate.getMonth() + 1,
  0
).getDate();
const days = Array.from(
  { length: daysInMonth },
  (_, index) => index + 1
);
const firstDayOfMonth = new Date(
  year,
  currentDate.getMonth(),
  1
).getDay();
const goToPreviousMonth = () => {
  setCurrentDate(
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    )
  );
};
const goToNextMonth = () => {
  setCurrentDate(
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    )
  );
};
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
  <div>
    <div className="calendar-header">
      <button onClick={goToPreviousMonth}>
        ←
      </button>
<h2> {month} {year} </h2>
     

      <button onClick={goToNextMonth}>
        →
      </button>
    </div>

    <div className="calendar">
      {weekDays.map((weekDay) => (
        <div className="weekday" key={weekDay}>
          {weekDay}
        </div>
      ))}

      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
        <div className="empty-day" key={`empty-${index}`}></div>
      ))}

    {days.map((day) => {
  const monthNumber = String(
    currentDate.getMonth() + 1
  ).padStart(2, "0");

  const dayNumber = String(day).padStart(2, "0");

  const dateString = `${year}-${monthNumber}-${dayNumber}`;
  const dayAttendance = attendance[dateString] || {};

  return (
     <div
    className={`calendar-day ${
      selectedDate === dateString ? "selected-day" : ""
    }`}
    key={day}
    onClick={() => setSelectedDate(dateString)}
  >
    {day}
    <div className="calendar-attendance">
  <img
    src={`/powerpuff/hima-${
      dayAttendance.hima ? "hap" : "mis"
    }.png`}
    alt="Hima"
  />

  <img
    src={`/powerpuff/hunter-${
      dayAttendance.hunter ? "hap" : "mis"
    }.png`}
    alt="Hunter"
  />

  <img
    src={`/powerpuff/chinju-${
      dayAttendance.chinju ? "hap" : "mis"
    }.png`}
    alt="Chinju"
  />
</div>

  </div>

);
})}

    </div>
  </div>
);}