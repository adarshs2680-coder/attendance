"use client";

import MemberToggle from "./MemberToggle";
import { useState,useEffect } from "react";
import { supabase } from "../lib/supabase";
import AttendanceCalendar from "./AttendanceCalendar";

export default function AttendanceMarker() {
  
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  

  const [attendance, setAttendance] = useState({});
 
  const toggleAttendance = async (person) => {
  const currentAttendance = attendance[selectedDate] || {};

  const newValue = !currentAttendance[person];

  // Update the screen immediately
  setAttendance((previous) => ({
    ...previous,

    [selectedDate]: {
      ...previous[selectedDate],
      [person]: newValue,
    },
  }));

  // Check if this date already exists in Supabase
  const { data: existingRow, error: findError } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", selectedDate)
    .maybeSingle();

  if (findError) {
    console.error("Error finding attendance:", findError);
    return;
  }

  let error;

  if (existingRow) {
    // Update existing date
    const result = await supabase
      .from("attendance")
      .update({
        [person]: newValue,
      })
      .eq("date", selectedDate);

    error = result.error;
  } else {
    // Create a new date
    const result = await supabase
      .from("attendance")
      .insert({
        date: selectedDate,
        hima: person === "hima" ? newValue : false,
        hunter: person === "hunter" ? newValue : false,
        chinju: person === "chinju" ? newValue : false,
      });

    error = result.error;
  }

  if (error) {
    console.error("Error saving attendance:", error);
  } else {
    console.log("Attendance saved to Supabase!");
  }
};
useEffect(() => {
  const loadAttendance = async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select("*");

    if (error) {
      console.error("Error loading attendance:", error);
      return;
    }

    const formattedAttendance = {};

    data.forEach((row) => {
      formattedAttendance[row.date] = {
        hima: row.hima,
        hunter: row.hunter,
        chinju: row.chinju,
      };
    });

    setAttendance(formattedAttendance);
   
  };

  loadAttendance();
}, []);

  

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