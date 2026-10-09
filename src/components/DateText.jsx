"use client";

import { useEffect, useState } from "react";

export default function DateText() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const formattedDate = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    setDate(formattedDate);
  }, []);

  return (
    <span className="mt-0.5 text-[10px] font-medium text-gray-600 sm:text-xs">
      {date || "\u00A0"}
    </span>
  );
}

