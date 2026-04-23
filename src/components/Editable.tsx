import React from "react";
import { motion } from "motion/react";
import { Edit3 } from "lucide-react";
import { cn } from "../lib/utils";

interface EditableProps {
  children: React.ReactNode;
  isEditMode?: boolean;
  onEdit?: () => void;
  className?: string;
}

export default function Editable({ children, isEditMode, onEdit, className }: EditableProps) {
  if (!isEditMode) return <>{children}</>;

  return (
    <div className={cn("group relative", className)}>
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 z-[60] flex items-center justify-center bg-oaka-gold/20 backdrop-blur-[2px] cursor-pointer border-2 border-dashed border-oaka-gold"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.();
        }}
      >
        <button className="flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-oaka-green shadow-2xl transition-transform active:scale-95">
          <Edit3 size={18} />
          Edit this section
        </button>
      </motion.div>
    </div>
  );
}
