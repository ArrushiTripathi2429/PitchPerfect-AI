"use client";
import React from "react";
import { SparklesCore } from "../components/ui/sparkles";

export function SparklesPreview() {
  return (
    <div
      className="h-[25rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1
        className="relative z-20 text-3xl font-bold text-center text-red-500 md:text-7xl lg:text-9xl">
        PitchPerfect-AI
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div
          className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div
          className="absolute top-0 w-3/4 h-px inset-x-20 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        <div
          className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div
          className="absolute top-0 w-1/4 h-px inset-x-60 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

  
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF" />

        
        <div
          className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}
