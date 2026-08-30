"use client";

import MemberToggle from "./MemberToggle";
import { useState,useEffect } from "react";
import AttendanceCalendar from "./AttendanceCalendar";

export default function AttendanceMarker() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});
 const [loaded, setLoaded] = useState(false);
  const toggleAttendance = (person) => {
    setAttendance((previous) => ({
      ...previous,

      [selectedDate]: {
        ...previous[selectedDate],

        [person]: !(previous[selectedDate]?.[person] || false),
      },
    }));
  };
useEffect(() => {
  const savedAttendance = localStorage.getItem("attendance");

  if (savedAttendance) {
    setAttendance(JSON.parse(savedAttendance));
  }

  setLoaded(true);
}, []);

useEffect(() => {
  if (loaded) {
    localStorage.setItem(
      "attendance",
      JSON.stringify(attendance)
    );
  }
}, [attendance, loaded]);
 return (
  <main className="attendance-page">
    <h1>Attendance</h1>

    <div className="attendance-layout">
      
      <section className="attendance-panel">
        <h2>Mark Attendance</h2>

       <div className="selected-date">
  <span>Selected Date</span>
  <strong>{selectedDate}</strong>
</div>

        <MemberToggle
          name="Hima"
          present={attendance[selectedDate]?.hima || false}
          onToggle={() => toggleAttendance("hima")}
        />

        <MemberToggle
          name="Hunter"
          present={attendance[selectedDate]?.hunter || false}
          onToggle={() => toggleAttendance("hunter")}
        />

        <MemberToggle
          name="Chinju"
          present={attendance[selectedDate]?.chinju || false}
          onToggle={() => toggleAttendance("chinju")}
        />
      </section>

      <section className="calendar-panel">
        <AttendanceCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          attendance={attendance}
        />
      </section>

    </div>
  </main>

  );
}