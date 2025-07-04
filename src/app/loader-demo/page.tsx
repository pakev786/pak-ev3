'use client';
import React from "react";
import Loader from "@/components/Loader";
import LoaderPulse from "@/components/LoaderPulse";
import LoaderDots from "@/components/LoaderDots";
import LoaderDualRing from "@/components/LoaderDualRing";
import LoaderEV from "@/components/LoaderEV";

export default function LoaderDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-primary">Loader Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-2xl">
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold">Default Circular Loader</div>
          <Loader size={64} />
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold">Pulse Loader</div>
          <LoaderPulse size={64} />
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold">Dots Loader</div>
          <LoaderDots size={18} />
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold">Dual Ring Loader</div>
          <LoaderDualRing size={64} />
        </div>
        <div className="flex flex-col items-center">
          <div className="mb-2 font-semibold">EV Bolt Loader</div>
          <LoaderEV size={64} />
        </div>
      </div>
      <div className="mt-10 text-gray-600 text-center">
        آپ ان میں سے جو بھی لوڈر پسند کریں، بتا دیں، وہ پوری سائٹ پر لگا دوں گا!
      </div>
    </div>
  );
}
