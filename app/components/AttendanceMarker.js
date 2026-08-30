"use client";

import MemberToggle from "./MemberToggle";
import { useState,useEffect } from "react";

export default function AttendanceMarker() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});

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
}, []);
  return (
    <div>
      <h2>Mark Attendance</h2>

      <p>Selected date: {selectedDate}</p>

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
    </div>
  );
}