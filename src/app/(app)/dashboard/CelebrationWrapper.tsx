"use client";

import dynamic from "next/dynamic";

const Celebration = dynamic(() => import("@/components/Celebration"), {
  ssr: false,
});

export default function CelebrationWrapper() {
  return <Celebration />;
}
