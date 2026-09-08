"use client";

export default function MemberToggle({
  name,
  present,
  onToggle,
  disabled,
}) {
  const sample = name.toLowerCase();

  return (
    <div className="member">
      <h3>{name}</h3>

      <button
        className={`toggle ${sample} ${present ? "active" : ""}`}
        onClick={onToggle}
        disabled={disabled}
      >
        <img
          src={
            present
              ? `/powerpuff/${sample}-hap.png`
              : `/powerpuff/${sample}-mis.png`
          }
          alt={present ? "Present" : "Absent"}
          className="toggle-image"
        />
      </button>
    </div>
  );
}