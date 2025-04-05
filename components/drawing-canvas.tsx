"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Eraser } from "lucide-react";
import type { Alphabet } from "@/lib/alphabets";
import confetti from "canvas-confetti";

interface DrawingCanvasProps {
  alphabet: Alphabet;
  onComplete: (accuracy: number) => void;
  backgroundSvg: string;
}

// Define a mapping for predicted letter outputs
const letterMapping: Record<string, number> = {
  character_1_ka: 11,
  character_2_kha: 12,
  character_3_ga: 13,
  character_4_gha: 14,
  character_5_nga: 15,
  character_6_cha: 16,
  character_7_chha: 17,
  character_8_ja: 18,
  character_9_jha: 19,
  character_10_yna: 20,
  character_11_taamatar: 21,
  character_12_thaa: 22,
  character_13_daa: 23,
  character_14_dhaa: 24,
  character_15_adna: 25,
  character_16_tabala: 26,
  character_17_tha: 27,
  character_18_da: 28,
  character_19_dha: 29,
  character_20_na: 30,
  character_21_pa: 31,
  character_22_pha: 32,
  character_23_ba: 33,
  character_24_bha: 34,
  character_25_ma: 35,
  character_26_yaw: 36,
  character_27_ra: 37,
  character_28_la: 38,
  character_29_waw: 39,
  character_30_motosaw: 40,
  character_31_petchiryakha: 41,
  character_32_patalosaw: 42,
  character_33_ha: 43,
  character_34_chhya: 44,
  character_35_tra: 45,
  character_36_gya: 46,
};

export default function DrawingCanvas({
  alphabet,
  onComplete,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [strokes, setStrokes] = useState<
    Array<{ x: number; y: number; isDrawing: boolean }>
  >([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );
  const [drawingTimeout, setDrawingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set canvas background to black
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Set line style for drawing
    context.lineWidth = 8;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "white"; // White stroke for drawing

    setCtx(context);

    // Clear canvas when alphabet changes
    clearCanvas();

    // Draw guide pattern
    // drawGuidePattern(context, alphabet);
  }, [alphabet]);

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = "black"; // Reset background to black
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setStrokes([]);
    setFeedback(null);

    // drawGuidePattern(ctx, alphabet);
  };

  const drawGuidePattern = (
    context: CanvasRenderingContext2D,
    alphabet: Alphabet
  ) => {
    // Draw a faint guide pattern based on the alphabet
    context.save();
    context.globalAlpha = 0.15;
    context.lineWidth = 6;
    context.strokeStyle = "#6366f1";

    // Draw guide strokes
    alphabet.strokes.forEach((stroke) => {
      const path = new Path2D(stroke);
      context.stroke(path);
    });

    // Draw background letter
    context.globalAlpha = 0.2; // Make the text more faint
    context.font = "bold 180px Arial"; // Adjust font size as needed
    context.fillStyle = "#d1d5db"; // Light gray color
    context.textAlign = "center";
    context.textBaseline = "middle";
    const { width, height } = context.canvas;

    if (alphabet.character) {
      context.fillText(alphabet.character, width / 2, height / 2); // Centered letter
    }

    context.restore();
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true);

    // Clear any pending timeout since the child resumed drawing
    if (drawingTimeout) clearTimeout(drawingTimeout);

    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);

    setStrokes((prev) => [...prev, { x, y, isDrawing: false }]);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Get the scale factor to handle different screen sizes
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x: number, y: number;

    if ("touches" in e) {
      x = (e.touches[0].clientX - rect.left) * scaleX;
      y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    // If starting a new stroke after lifting the pen, reset the path
    if (strokes.length === 0 || !strokes[strokes.length - 1].isDrawing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    setStrokes((prev) => [...prev, { x, y, isDrawing: true }]);
  };

  // const endDrawing = () => {
  //   setIsDrawing(false);
  //   if (ctx) ctx.closePath();

  //   // Clear any existing timeout to prevent multiple calls to analyzeDrawing
  //   if (drawingTimeout) {
  //     clearTimeout(drawingTimeout);
  //   }

  //   // Wait 3 seconds before analyzing, unless the user starts drawing again
  //   const timeout = setTimeout(() => {
  //     analyzeDrawing();
  //   }, 3000);

  //   setDrawingTimeout(timeout);
  // };

  const endDrawing = () => {
    setIsDrawing(false);
    if (ctx) ctx.closePath();
  };

  const handleSubmit = () => {
    analyzeDrawing();
  };

  let userDrawingImage: string | null = null;

  const IMG_HEIGHT = 32;
  const IMG_WIDTH = 32;

  const analyzeDrawing = async () => {
    if (strokes.length < 5) {
      setFeedback("incorrect");
      onComplete(0);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate bounding box of strokes
    const xValues = strokes.map((s) => s.x);
    const yValues = strokes.map((s) => s.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const width = maxX - minX;
    const height = maxY - minY;

    if (width < 10 || height < 10) {
      setFeedback("incorrect");
      onComplete(0);
      return;
    }

    // Create a cropped canvas
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx) {
      console.error("Failed to get 2D context for cropping.");
      return;
    }

    croppedCtx.drawImage(
      canvas,
      minX,
      minY,
      width,
      height,
      0,
      0,
      width,
      height
    );

    // Resize the cropped image to 32x32
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = IMG_WIDTH;
    resizedCanvas.height = IMG_HEIGHT;
    const resizedCtx = resizedCanvas.getContext("2d");

    if (!resizedCtx) {
      console.error("Failed to get 2D context for resizing.");
      return;
    }

    resizedCtx.drawImage(croppedCanvas, 0, 0, IMG_WIDTH, IMG_HEIGHT);

    // Convert the resized image to a Blob
    const imageData = resizedCanvas.toDataURL("image/png");
    const blob = await (await fetch(imageData)).blob();

    // Prepare FormData
    const formData = new FormData();
    formData.append("image", blob, "drawing.png");

    let isValidPrediction = false;
    let isHighAccuracy = false;
    let prediction;

    try {
      const response = await fetch("http://127.0.0.1:5003/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Prediction Result:", result);

      if (response.ok && result.prediction !== "Unknown") {
        prediction = result.prediction;

        // Retrieve currentAlphabetId from localStorage
        const currentAlphabetId = parseInt(
          localStorage.getItem("currentAlphabetId") || "0",
          10
        );
        console.log("currentAlphabetId", currentAlphabetId);
        // Map the prediction to its numeric value
        const mappedValue = letterMapping[prediction] || 0;
        console.log("mappedValue", mappedValue);
        // Compare the mapped value with currentAlphabetId
        if (mappedValue === currentAlphabetId) {
          isValidPrediction = true;
        }
      }
    } catch (error) {
      console.error("Error sending image to backend:", error);
    }

    // Compare strokes with expected pattern
    const correctPattern = 210; // Expected strokes
    const drawnPattern = strokes.length;

    // Calculate accuracy
    let accuracy = (drawnPattern / correctPattern) * 100;
    accuracy = Math.max(10, Math.min(100, accuracy));

    if (accuracy > 75) {
      isHighAccuracy = true;
    }

    // Set feedback based on prediction and accuracy
    if (isValidPrediction && isHighAccuracy) {
      setFeedback("correct");
      confetti({ particleCount: 100, spread: 70 });
    } else {
      setFeedback("incorrect");
    }

    // Always call onComplete with accuracy
    onComplete(accuracy);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full border-4 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 shadow-inner border-purple-300">
        {/* Feedback overlay */}
        {feedback && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-opacity-40 z-10 ${
              feedback === "correct" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div
              className={`rounded-full p-4 ${
                feedback === "correct" ? "bg-green-100" : "bg-red-100"
              } shadow-xl animate-bounce`}
            >
              {feedback === "correct" ? (
                <Check className="h-12 w-12 text-green-600" />
              ) : (
                <X className="h-12 w-12 text-red-600" />
              )}
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full aspect-square touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>

      {/* Buttons side by side */}
      <div className="mt-6 flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={clearCanvas}
          className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white border-none rounded-full px-6 shadow-md"
        >
          <Eraser className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-500 to-purple-500 hover:from-green-600 hover:to-purple-600 text-white border-none rounded-full px-6 shadow-md"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
