"use client";

import MemberToggle from "./MemberToggle";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AttendanceCalendar from "./AttendanceCalendar";

export default function AttendanceMarker() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendance, setAttendance] = useState({});
  const [isWorkingDay, setIsWorkingDay] = useState(true);

  // Calculate attendance percentage
  const calculatePercentage = (person) => {
    const workingDays = Object.values(attendance).filter(
      (day) => day.working === true
    );

    if (workingDays.length === 0) {
      return 0;
    }

    const attendedDays = workingDays.filter(
      (day) => day[person] === true
    );

    return Math.round(
      (attendedDays.length / workingDays.length) * 100
    );
  };

  // Toggle Working Day
  const toggleWorkingDay = async () => {
    const newWorkingStatus = !isWorkingDay;
    const existingAttendance = attendance[selectedDate];

    if (existingAttendance) {
      const { error } = await supabase
        .from("attendance")
        .update({
          working: newWorkingStatus,

          // Clear attendance when day is OFF
          hima: newWorkingStatus
            ? existingAttendance.hima
            : false,

          hunter: newWorkingStatus
            ? existingAttendance.hunter
            : false,

          chinju: newWorkingStatus
            ? existingAttendance.chinju
            : false,
        })
        .eq("date", selectedDate);

      if (error) {
        console.error("Error updating working day:", error);
        return;
      }

      setAttendance((previous) => ({
        ...previous,

        [selectedDate]: {
          ...previous[selectedDate],

          working: newWorkingStatus,

          hima: newWorkingStatus
            ? previous[selectedDate]?.hima || false
            : false,

          hunter: newWorkingStatus
            ? previous[selectedDate]?.hunter || false
            : false,

          chinju: newWorkingStatus
            ? previous[selectedDate]?.chinju || false
            : false,
        },
      }));
    } else {
      const { error } = await supabase
        .from("attendance")
        .insert({
          date: selectedDate,
          working: newWorkingStatus,
          hima: false,
          hunter: false,
          chinju: false,
        });

      if (error) {
        console.error("Error creating working day:", error);
        return;
      }

      setAttendance((previous) => ({
        ...previous,

        [selectedDate]: {
          working: newWorkingStatus,
          hima: false,
          hunter: false,
          chinju: false,
        },
      }));
    }

    setIsWorkingDay(newWorkingStatus);
  };

  // Toggle individual attendance
  const toggleAttendance = async (person) => {
    // Don't allow attendance on OFF days
    if (!isWorkingDay) {
      return;
    }

    const currentAttendance = attendance[selectedDate] || {};
    const newValue = !currentAttendance[person];

    // Check if date already exists
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
      // Update existing row
      const result = await supabase
        .from("attendance")
        .update({
          [person]: newValue,
        })
        .eq("date", selectedDate);

      error = result.error;
    } else {
      // Create new working day
      const result = await supabase
        .from("attendance")
        .insert({
          date: selectedDate,
          working: true,
          hima: person === "hima" ? newValue : false,
          hunter: person === "hunter" ? newValue : false,
          chinju: person === "chinju" ? newValue : false,
        });

      error = result.error;
    }

    if (error) {
      console.error("Error saving attendance:", error);
      return;
    }

    // Update local state after successful save
    setAttendance((previous) => ({
      ...previous,

      [selectedDate]: {
        ...previous[selectedDate],
        working: true,
        [person]: newValue,
      },
    }));

    console.log("Attendance saved to Supabase!");
  };

  // Load attendance from Supabase
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
          working: row.working,
          hima: row.hima,
          hunter: row.hunter,
          chinju: row.chinju,
        };
      });

      setAttendance(formattedAttendance);
    };

    loadAttendance();
  }, []);

  // Update Working Day when selected date changes
  useEffect(() => {
    setIsWorkingDay(
      attendance[selectedDate]?.working ?? true
    );
  }, [selectedDate, attendance]);

  return (
    <main className="attendance-page">
      <h1>Attendance</h1>

      <div className="attendance-layout">

        {/* Attendance Panel */}
        <section className="attendance-panel">
          <h2>Mark Attendance</h2>

          <div className="selected-date">
            <span>Selected Date</span>
            <strong>{selectedDate}</strong>
          </div>

          {/* Working Day Switch */}
          <div className="working-day">
            <span>Working Day</span>

            <button
              className={`working-toggle ${
                isWorkingDay ? "on" : "off"
              }`}
              onClick={toggleWorkingDay}
            >
              {isWorkingDay ? "ON" : "OFF"}
            </button>
          </div>

          {/* Hima */}
          <MemberToggle
            name="Hima"
            present={
              attendance[selectedDate]?.hima || false
            }
            onToggle={() =>
              toggleAttendance("hima")
            }
            disabled={!isWorkingDay}
          />

          {/* Hunter */}
          <MemberToggle
            name="Hunter"
            present={
              attendance[selectedDate]?.hunter || false
            }
            onToggle={() =>
              toggleAttendance("hunter")
            }
            disabled={!isWorkingDay}
          />

          {/* Chinju */}
          <MemberToggle
            name="Chinju"
            present={
              attendance[selectedDate]?.chinju || false
            }
            onToggle={() =>
              toggleAttendance("chinju")
            }
            disabled={!isWorkingDay}
          />

          <div className="attendance-percentage">
  <h3>Attendance Percentage</h3>

  <div className="percentage-item">
    <div className="percentage-label">
      <span>Hima</span>
      <strong>{calculatePercentage("hima")}%</strong>
    </div>

    <div className="percentage-bar">
      <div
        className="percentage-fill"
        style={{
          width: `${calculatePercentage("hima")}%`,
        }}
      ></div>
    </div>
  </div>

  <div className="percentage-item">
    <div className="percentage-label">
      <span>Hunter</span>
      <strong>{calculatePercentage("hunter")}%</strong>
    </div>

    <div className="percentage-bar">
      <div
        className="percentage-fill"
        style={{
          width: `${calculatePercentage("hunter")}%`,
        }}
      ></div>
    </div>
  </div>

  <div className="percentage-item">
    <div className="percentage-label">
      <span>Chinju</span>
      <strong>{calculatePercentage("chinju")}%</strong>
    </div>

    <div className="percentage-bar">
      <div
        className="percentage-fill"
        style={{
          width: `${calculatePercentage("chinju")}%`,
        }}
      ></div>
    </div>
  </div>
</div>
        </section>

        {/* Calendar */}
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